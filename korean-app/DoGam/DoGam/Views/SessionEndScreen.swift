import SwiftUI

/// The "end" beat after the last card in today's book.
struct SessionEndScreen: View {
    let day: Int
    let onDone: () -> Void

    var body: some View {
        FigmaScreen {
            VStack(spacing: 20) {
                Spacer()

                Text("오늘의 기록 완료")
                    .font(Theme.heading(26))
                    .foregroundStyle(Theme.ink)

                Text("Today's note is complete — book \(KoreanCounting.word(for: day)) joins the shelf.")
                    .font(Theme.heading(16))
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Theme.ink.opacity(0.7))
                    .frame(width: 260)

                Spacer()

                LiquidGlassButton(title: "Done", action: onDone)
                    .padding(.horizontal, 36)
                    .padding(.bottom, 40)
            }
        }
    }
}
