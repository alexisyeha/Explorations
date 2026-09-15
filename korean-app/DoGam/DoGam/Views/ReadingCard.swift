import SwiftUI

/// The bordered paper card (Figma "Rectangle 8" + photo), with a corner that
/// rolls away in 3D as the reading is recognized.
struct ReadingCard: View {
    let card: CardItem
    /// 0 = flat, 1 = fully rolled away.
    let peelProgress: CGFloat
    /// True while the "wrong answer" placeholder shake is playing.
    let isWrong: Bool

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width
            let h = geo.size.height

            ZStack {
                Image("CardBorder")
                    .resizable()
                    .frame(width: w, height: h)

                // Paper grain so the card reads as real stock, not a flat
                // color fill.
                Image("HanjiLight")
                    .resizable(resizingMode: .tile)
                    .opacity(0.6)
                    .blendMode(.multiply)
                    .frame(width: w, height: h)
                    .clipShape(RoundedRectangle(cornerRadius: 6))
                    .allowsHitTesting(false)

                Image(card.imageName)
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .foregroundStyle(Theme.ink)
                    .padding(w * 0.14)
                    .frame(width: w, height: h)
                    .opacity(1 - 0.63 * peelProgress)
                    .offset(y: 6 * peelProgress)

                if peelProgress > 0 {
                    rollingCorner(width: w, height: h)
                }
            }
        }
        .rotationEffect(.degrees(card.rotationDegrees))
        .modifier(ShakeEffect(shakes: isWrong ? 3 : 0))
    }

    private func rollingCorner(width w: CGFloat, height h: CGFloat) -> some View {
        let size = min(w, h) * 0.6 * peelProgress
        func foldPath() -> Path {
            Path { path in
                path.move(to: CGPoint(x: w, y: h - size))
                path.addLine(to: CGPoint(x: w, y: h))
                path.addLine(to: CGPoint(x: w - size, y: h))
                path.addQuadCurve(
                    to: CGPoint(x: w, y: h - size),
                    control: CGPoint(x: w - size * 0.35, y: h - size * 0.35)
                )
            }
        }
        return ZStack(alignment: .bottomTrailing) {
            foldPath()
                .fill(Theme.paper)
                .overlay(
                    Image("HanjiLight")
                        .resizable(resizingMode: .tile)
                        .opacity(0.5)
                        .blendMode(.multiply)
                        .clipShape(foldPath())
                )
                .shadow(color: .black.opacity(0.18), radius: 5, x: -2, y: -2)
            foldPath()
                .stroke(Theme.ink.opacity(0.5), lineWidth: 1)
        }
        .frame(width: w, height: h)
        // The 3D "roll" — the lifted corner tips away from the viewer,
        // increasingly so as it peels further off the card.
        .rotation3DEffect(
            .degrees(Double(peelProgress) * 55),
            axis: (x: 1, y: -1, z: 0),
            anchor: .bottomTrailing,
            perspective: 0.6
        )
    }
}

/// A quick horizontal shake — the placeholder "wrong answer" feedback until
/// a real design exists for it.
struct ShakeEffect: GeometryEffect {
    var shakes: CGFloat
    var animatableData: CGFloat {
        get { shakes }
        set { shakes = newValue }
    }

    func effectValue(size: CGSize) -> ProjectionTransform {
        let translation = 6 * sin(shakes * .pi * 2)
        return ProjectionTransform(CGAffineTransform(translationX: translation, y: 0))
    }
}
