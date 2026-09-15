import SwiftUI

/// Figma's "Button - Liquid Glass - Text" component: a black pill with a
/// soft white edge highlight and drop shadow.
struct LiquidGlassButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 17, weight: .medium))
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
        }
        .background(Theme.ink, in: Capsule())
        .overlay(
            Capsule().strokeBorder(Color.white.opacity(0.12), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.15), radius: 8, y: 4)
    }
}

/// The recording-in-progress state: the button morphs into a dark pill
/// showing the actual live mic level (Figma: "Audio Visualizer", but driven
/// by real input here rather than a fixed mock waveform).
struct AudioVisualizerBar: View {
    let levels: [CGFloat]

    var body: some View {
        HStack(spacing: 3) {
            ForEach(Array(levels.enumerated()), id: \.offset) { _, h in
                RoundedRectangle(cornerRadius: 2)
                    .fill(Color.white.opacity(0.81))
                    .frame(width: 4, height: max(4, h * 26))
                    .animation(.linear(duration: 0.05), value: h)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(Color(white: 0.078).opacity(0.85), in: Capsule())
    }
}
