import SwiftUI

/// One "Word N" reading session — idle → recording → success.
///
/// The roll-away is driven by an automatic timer once recording starts
/// (per Alex: "the rolling effect will happen automatically based on the
/// timer, but will be faster when user inputs the correct answer"). A
/// correct match speeds the timer to finish almost immediately; a
/// non-matching attempt nudges it backward with a shake — a placeholder
/// since the real "wrong answer" behavior hasn't been designed yet.
struct WordCardScreen: View {
    let card: CardItem
    let onFinished: () -> Void

    private enum Phase { case idle, recording, success }

    @State private var phase: Phase = .idle
    @State private var peelProgress: CGFloat = 0
    @State private var virtualElapsed: Double = 0
    @State private var targetDuration: Double = 9.0
    @State private var isWrong = false
    @State private var rollTask: Task<Void, Never>?
    @State private var lastWrongFlagAt: Date = .distantPast
    @StateObject private var speech = SpeechRecognizer()

    /// How long the auto-roll takes with no input at all.
    private let idleRollDuration: Double = 9.0
    /// How long it takes to finish once a correct answer lands.
    private let correctFinishDuration: Double = 0.5

    var body: some View {
        FigmaScreen {
            VStack(spacing: 20) {
                Spacer(minLength: 8)

                Text(card.title)
                    .font(Theme.heading(28))
                    .foregroundStyle(Theme.ink)

                Spacer(minLength: 0)

                VStack(spacing: 28) {
                    ReadingCard(card: card, peelProgress: peelProgress, isWrong: isWrong)
                        .frame(width: card.cardSize.width, height: card.cardSize.height)

                    SquiggleAnswerRow(chunks: card.answerChunks, revealed: phase != .idle)
                        .padding(.horizontal, 36)
                }

                Spacer(minLength: 0)

                actionArea
                    .padding(.horizontal, 36)
                    .padding(.bottom, 32)
            }
        }
        .onDisappear {
            rollTask?.cancel()
            speech.stop()
        }
    }

    @ViewBuilder
    private var actionArea: some View {
        VStack(spacing: 12) {
            switch phase {
            case .idle:
                LiquidGlassButton(title: "Start Recording", action: startRecording)
            case .recording:
                AudioVisualizerBar(levels: speech.levels)
            case .success:
                LiquidGlassButton(title: "Success!", action: onFinished)
            }

            if phase != .success {
                Button("Can't speak now", action: skipToSuccess)
                    .font(Theme.heading(14))
                    .foregroundStyle(Theme.ink)
            }
        }
    }

    private func startRecording() {
        phase = .recording
        virtualElapsed = 0
        targetDuration = idleRollDuration
        beginRollTimer()

        Task {
            let granted = await speech.requestAuthorization()
            guard granted else { return }
            speech.onTranscriptUpdate = { transcript in evaluate(transcript: transcript) }
            try? speech.start()
        }
    }

    private func beginRollTimer() {
        rollTask?.cancel()
        rollTask = Task {
            while !Task.isCancelled {
                virtualElapsed += 1.0 / 30.0
                let progress = min(1, virtualElapsed / targetDuration)
                await MainActor.run { peelProgress = progress }
                if progress >= 1 {
                    await MainActor.run { finishRecording() }
                    return
                }
                try? await Task.sleep(nanoseconds: 1_000_000_000 / 30)
            }
        }
    }

    /// Placeholder correctness check: does the transcript contain any of
    /// this card's expected chunks? Real matching (fuzzy pronunciation,
    /// partial credit, etc.) isn't designed yet.
    private func evaluate(transcript: String) {
        guard phase == .recording else { return }
        let normalized = transcript.replacingOccurrences(of: " ", with: "")
        guard !normalized.isEmpty else { return }

        let isCorrect = card.answerChunks.contains { normalized.contains($0) }
        if isCorrect {
            targetDuration = min(targetDuration, virtualElapsed + correctFinishDuration)
        } else if normalized.count >= 2, Date().timeIntervalSince(lastWrongFlagAt) > 1.2 {
            flagWrong()
        }
    }

    private func flagWrong() {
        lastWrongFlagAt = Date()
        virtualElapsed = max(0, virtualElapsed - targetDuration * 0.18)
        withAnimation(.default) { isWrong.toggle() }
    }

    private func finishRecording() {
        guard phase == .recording else { return }
        rollTask?.cancel()
        speech.stop()
        peelProgress = 1
        phase = .success
    }

    private func skipToSuccess() {
        rollTask?.cancel()
        speech.stop()
        withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
            peelProgress = 1
            phase = .success
        }
    }
}
