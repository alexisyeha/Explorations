import SwiftUI

/// Shown right after tapping today's pulsing book on the home still life,
/// before the first card — the "opening the book" beat in:
/// home → object → tap → cover → card 1 → card 2 → … → end.
struct BookCoverScreen: View {
    let day: Int
    let onOpen: () -> Void

    var body: some View {
        FigmaScreen {
            VStack(spacing: 0) {
                Spacer()

                ZStack {
                    RoundedRectangle(cornerRadius: 2)
                        .fill(Theme.cardDark)
                        .frame(width: 260, height: 360)
                        .shadow(color: .black.opacity(0.3), radius: 10, y: 8)

                    VStack(spacing: 8) {
                        Text("도감")
                            .font(Theme.wordmark(22))
                            .tracking(2)
                        ForEach(Array(KoreanCounting.word(for: day)), id: \.self) { syllable in
                            Text(String(syllable))
                                .font(Theme.reading(20))
                        }
                    }
                    .foregroundStyle(.white)
                }
                .contentShape(Rectangle())
                .onTapGesture(perform: onOpen)

                Spacer()

                Text("Tap the book to begin")
                    .font(Theme.heading(16))
                    .foregroundStyle(Theme.ink.opacity(0.6))
                    .padding(.bottom, 60)
            }
        }
    }
}
