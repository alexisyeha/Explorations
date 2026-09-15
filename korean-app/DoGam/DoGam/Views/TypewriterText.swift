import SwiftUI

/// Reveals `text` one character at a time, like a typewriter, whenever
/// `trigger` flips from false to true.
struct TypewriterText: View {
    let text: String
    let trigger: Bool
    var charDelay: Double = 0.05
    var font: Font
    var color: Color

    @State private var visibleCount = 0
    @State private var task: Task<Void, Never>?

    var body: some View {
        Text(String(text.prefix(visibleCount)))
            .font(font)
            .foregroundStyle(color)
            .onAppear { if trigger { start() } }
            .onChange(of: trigger) { _, newValue in
                if newValue { start() } else { reset() }
            }
            .onDisappear { task?.cancel() }
    }

    private func start() {
        task?.cancel()
        visibleCount = 0
        let characters = Array(text)
        task = Task {
            for i in 0...characters.count {
                if Task.isCancelled { return }
                await MainActor.run { visibleCount = i }
                try? await Task.sleep(nanoseconds: UInt64(charDelay * 1_000_000_000))
            }
        }
    }

    private func reset() {
        task?.cancel()
        visibleCount = 0
    }
}
