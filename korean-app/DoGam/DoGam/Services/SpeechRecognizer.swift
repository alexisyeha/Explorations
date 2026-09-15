import Foundation
import Speech
import AVFoundation

/// Thin wrapper around on-device Korean SFSpeechRecognizer, plus a live
/// mic-level meter so the recording UI reflects actual input instead of a
/// canned animation.
@MainActor
final class SpeechRecognizer: ObservableObject {
    static let levelBarCount = 19

    @Published private(set) var isListening = false
    @Published private(set) var transcript = ""
    @Published var authorizationDenied = false
    /// Rolling window of recent mic levels, 0...1, most recent last —
    /// drives the live waveform bars.
    @Published private(set) var levels: [CGFloat] = Array(repeating: 0.04, count: levelBarCount)

    private let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "ko-KR"))
    private let audioEngine = AVAudioEngine()
    private var request: SFSpeechAudioBufferRecognitionRequest?
    private var task: SFSpeechRecognitionTask?

    /// Called on every updated partial/final transcript while listening.
    var onTranscriptUpdate: ((String) -> Void)?

    func requestAuthorization() async -> Bool {
        let speechStatus = await withCheckedContinuation { continuation in
            SFSpeechRecognizer.requestAuthorization { status in
                continuation.resume(returning: status)
            }
        }
        let micGranted = await AVAudioApplication.requestRecordPermission()
        let granted = speechStatus == .authorized && micGranted
        authorizationDenied = !granted
        return granted
    }

    func start() throws {
        stop()

        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.record, mode: .measurement, options: .duckOthers)
        try session.setActive(true, options: .notifyOthersOnDeactivation)

        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true
        if recognizer?.supportsOnDeviceRecognition == true {
            request.requiresOnDeviceRecognition = true
        }
        self.request = request

        let inputNode = audioEngine.inputNode
        let format = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: format) { [weak self] buffer, _ in
            self?.request?.append(buffer)
            let level = Self.rmsLevel(of: buffer)
            Task { @MainActor in self?.pushLevel(level) }
        }

        audioEngine.prepare()
        try audioEngine.start()
        isListening = true

        task = recognizer?.recognitionTask(with: request) { [weak self] result, error in
            guard let self else { return }
            if let result {
                Task { @MainActor in
                    self.transcript = result.bestTranscription.formattedString
                    self.onTranscriptUpdate?(self.transcript)
                }
            }
            if error != nil || (result?.isFinal ?? false) {
                Task { @MainActor in self.stop() }
            }
        }
    }

    func stop() {
        guard isListening || audioEngine.isRunning else { return }
        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)
        request?.endAudio()
        task?.cancel()
        task = nil
        request = nil
        isListening = false
        levels = Array(repeating: 0.04, count: Self.levelBarCount)
    }

    func reset() {
        transcript = ""
    }

    private func pushLevel(_ level: CGFloat) {
        levels.removeFirst()
        levels.append(level)
    }

    /// Simple RMS-based loudness, normalized against a typical speech range.
    private static func rmsLevel(of buffer: AVAudioPCMBuffer) -> CGFloat {
        guard let channelData = buffer.floatChannelData else { return 0 }
        let frameLength = Int(buffer.frameLength)
        guard frameLength > 0 else { return 0 }
        let samples = channelData[0]
        var sum: Float = 0
        for i in 0..<frameLength {
            let s = samples[i]
            sum += s * s
        }
        let rms = sqrt(sum / Float(frameLength))
        let normalized = min(1, rms * 12)
        return CGFloat(max(0.04, normalized))
    }
}
