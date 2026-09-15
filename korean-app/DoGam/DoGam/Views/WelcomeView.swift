import SwiftUI

/// Figma 45:1013 — the cold-launch welcome screen.
struct WelcomeView: View {
    let onStart: () -> Void

    var body: some View {
        FigmaScreen {
            VStack(spacing: 0) {
                Text("DOGAM")
                    .font(Theme.wordmark(28))
                    .tracking(2)
                    .foregroundStyle(Theme.ink)
                    .padding(.top, 118 - 28)

                Spacer(minLength: 0)

                Image("StillLife")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 172)
                    .padding(.bottom, 24)

                Spacer(minLength: 0)

                Text("A daily field note for learning Korean handwriting")
                    .font(Theme.heading(20))
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Theme.ink)
                    .lineSpacing(4)
                    .frame(width: 269)
                    .padding(.bottom, 48)

                LiquidGlassButton(title: "Start today's note", action: onStart)
                    .padding(.horizontal, 36)
                    .padding(.bottom, 40)
            }
        }
    }
}
