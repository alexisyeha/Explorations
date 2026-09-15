import SwiftUI

/// A page corner that rolls up like real paper wrapping around a small
/// cylinder — bands of shading + 3D rotation instead of a flat 2D triangle.
///
/// This is the reusable piece. See `PaperRollPrototypeView` below for an
/// isolated harness to tune `bandCount` / `rollRadius` / `shadowStrength`
/// before touching the real card in `ReadingCard.swift`.
struct PaperRollEffect: View {
    /// 0 = flat, 1 = fully rolled away.
    let progress: CGFloat
    /// The card's own artwork, shown faintly mirrored on the underside of
    /// the curl — like text bleeding through thin paper. Pass `nil` to skip.
    var contentImageName: String? = nil
    /// How thick the rolled tube looks, as a fraction of the roll's reach.
    var rollRadius: CGFloat = 0.5
    /// How dark the contact shadow under the roll gets at full progress.
    var shadowStrength: Double = 0.35
    /// How visible the mirrored bleed-through text is on the curl.
    var bleedThroughOpacity: Double = 0.16

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width
            let h = geo.size.height
            let reach = min(w, h) * 0.95 * progress

            if progress > 0.001 {
                ZStack(alignment: .bottomTrailing) {
                    // Contact shadow the roll casts back onto the page.
                    Ellipse()
                        .fill(Color.black.opacity(shadowStrength * Double(progress)))
                        .frame(width: reach * 1.3, height: reach * 0.55)
                        .blur(radius: reach * 0.18)
                        .offset(x: reach * 0.12, y: reach * 0.12)

                    // The exposed underside of the page, where it's lifted
                    // off entirely.
                    foldPath(w: w, h: h, reach: reach)
                        .fill(Theme.paper)
                        .overlay(
                            Image("HanjiLight")
                                .resizable(resizingMode: .tile)
                                .opacity(0.5)
                                .blendMode(.multiply)
                                .clipShape(foldPath(w: w, h: h, reach: reach))
                        )

                    // One continuous rolled tube, shaded with a smooth
                    // cylindrical gradient instead of discrete facets.
                    tube(w: w, h: h, reach: reach)
                }
                .frame(width: w, height: h)
            }
        }
    }

    private func foldPath(w: CGFloat, h: CGFloat, reach: CGFloat) -> Path {
        Path { path in
            path.move(to: CGPoint(x: w, y: h - reach))
            path.addLine(to: CGPoint(x: w, y: h))
            path.addLine(to: CGPoint(x: w - reach, y: h))
            path.addQuadCurve(
                to: CGPoint(x: w, y: h - reach),
                control: CGPoint(x: w - reach * 0.35, y: h - reach * 0.35)
            )
        }
    }

    /// A cylindrical shading ramp in warm paper tones: shadowed underside →
    /// bright highlight (where light grazes the curl) → mid tone → shadowed
    /// underside again. Smooth gradient stops read as a round tube; discrete
    /// bands read as a fan of party streamers.
    private var tubeGradient: LinearGradient {
        LinearGradient(
            stops: [
                .init(color: Color(red: 0.22, green: 0.18, blue: 0.13), location: 0.0),
                .init(color: Color(red: 0.62, green: 0.53, blue: 0.40), location: 0.16),
                .init(color: Color(red: 0.98, green: 0.95, blue: 0.87), location: 0.36),
                .init(color: Color(red: 0.99, green: 0.98, blue: 0.93), location: 0.46),
                .init(color: Color(red: 0.58, green: 0.49, blue: 0.37), location: 0.66),
                .init(color: Color(red: 0.24, green: 0.19, blue: 0.14), location: 0.88),
                .init(color: Color(red: 0.14, green: 0.11, blue: 0.08), location: 1.0),
            ],
            startPoint: .top,
            endPoint: .bottom
        )
    }

    private func tube(w: CGFloat, h: CGFloat, reach: CGFloat) -> some View {
        let length = reach * 1.6
        let thickness = max(3, reach * rollRadius * 0.6)
        let centerX = w - reach * 0.38
        let centerY = h - reach * 0.38

        return Capsule()
            .fill(tubeGradient)
            .frame(width: length, height: thickness)
            .overlay(bleedThrough(length: length, thickness: thickness))
            .clipShape(Capsule())
            .overlay(Capsule().strokeBorder(Color.black.opacity(0.15), lineWidth: 0.5))
            .shadow(color: .black.opacity(0.3), radius: 3, x: 0, y: 1.5)
            .rotationEffect(.degrees(-45))
            .position(x: centerX, y: centerY)
    }

    /// The card's own art, mirrored and dimmed, as if showing through the
    /// thin paper from the other side of the curl.
    @ViewBuilder
    private func bleedThrough(length: CGFloat, thickness: CGFloat) -> some View {
        if let contentImageName {
            Image(contentImageName)
                .renderingMode(.template)
                .resizable()
                .scaledToFill()
                .frame(width: length, height: thickness * 3)
                .scaleEffect(x: -1, y: 1)
                .foregroundStyle(Theme.ink)
                .opacity(bleedThroughOpacity)
                .blendMode(.multiply)
        }
    }
}

// MARK: - Prototype harness

/// Isolated test bed for the roll effect — open this file in Xcode and use
/// the canvas preview (no simulator install needed) to tune parameters live.
/// Once it feels right, copy the tuned numbers into `ReadingCard.swift`.
struct PaperRollPrototypeView: View {
    @State private var progress: CGFloat = 0.5
    @State private var rollRadius: Double = 0.5
    @State private var shadowStrength: Double = 0.35
    @State private var bleedThroughOpacity: Double = 0.16
    @State private var isPlaying = false
    @State private var playTask: Task<Void, Never>?

    var body: some View {
        VStack(spacing: 24) {
            ZStack {
                Image("CardBorder")
                    .resizable()
                    .frame(width: 308, height: 189)
                Image("CardWord1")
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .foregroundStyle(Theme.ink)
                    .padding(308 * 0.14)
                    .frame(width: 308, height: 189)
                PaperRollEffect(
                    progress: progress,
                    contentImageName: "CardWord1",
                    rollRadius: rollRadius,
                    shadowStrength: shadowStrength,
                    bleedThroughOpacity: bleedThroughOpacity
                )
                .frame(width: 308, height: 189)
            }
            .padding(.top, 40)

            VStack(alignment: .leading, spacing: 14) {
                labeledSlider("Progress", value: $progress, range: 0...1)
                labeledSlider("Roll radius", value: $rollRadius, range: 0.2...1.0)
                labeledSlider("Shadow strength", value: $shadowStrength, range: 0...0.7)
                labeledSlider("Bleed-through opacity", value: $bleedThroughOpacity, range: 0...0.4)

                HStack(spacing: 12) {
                    Button(isPlaying ? "Stop" : "Play (9s roll)") {
                        isPlaying ? stop() : play()
                    }
                    Button("Reset") {
                        stop()
                        progress = 0
                    }
                    Button("Snap to correct-answer speed") {
                        stop()
                        withAnimation(.easeOut(duration: 0.5)) { progress = 1 }
                    }
                }
                .buttonStyle(.bordered)
            }
            .padding(.horizontal, 24)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.paper)
    }

    private func labeledSlider(_ label: String, value: Binding<Double>, range: ClosedRange<Double>, isStepped: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("\(label): \(value.wrappedValue, specifier: isStepped ? "%.0f" : "%.2f")")
                .font(.caption)
            Slider(value: value, in: range)
        }
    }

    private func labeledSlider(_ label: String, value: Binding<CGFloat>, range: ClosedRange<CGFloat>) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("\(label): \(Double(value.wrappedValue), specifier: "%.2f")")
                .font(.caption)
            Slider(
                value: Binding(get: { Double(value.wrappedValue) }, set: { value.wrappedValue = CGFloat($0) }),
                in: Double(range.lowerBound)...Double(range.upperBound)
            )
        }
    }

    private func play() {
        isPlaying = true
        progress = 0
        playTask = Task {
            let duration = 9.0
            let start = Date()
            while !Task.isCancelled {
                let elapsed = Date().timeIntervalSince(start)
                let p = min(1, elapsed / duration)
                await MainActor.run { progress = CGFloat(p) }
                if p >= 1 { await MainActor.run { isPlaying = false }; return }
                try? await Task.sleep(nanoseconds: 1_000_000_000 / 30)
            }
        }
    }

    private func stop() {
        isPlaying = false
        playTask?.cancel()
    }
}

#Preview {
    PaperRollPrototypeView()
}
