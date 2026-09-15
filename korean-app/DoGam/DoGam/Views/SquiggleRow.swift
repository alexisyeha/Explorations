import SwiftUI

/// The hand-drawn dash under each answer chunk (Figma: Frame 18/19/20 —
/// the same sketchy underline asset reused at different widths). Blank
/// before reveal, holding the syllable/word once recognized.
struct SquiggleAnswer: View {
    let text: String?
    let width: CGFloat

    var body: some View {
        VStack(spacing: 6) {
            TypewriterText(
                text: text ?? "",
                trigger: text != nil,
                font: Theme.reading(20),
                color: Theme.ink
            )
            .frame(height: 24)
            Image("SquiggleDash")
                .renderingMode(.template)
                .resizable()
                .scaledToFit()
                .foregroundStyle(Theme.ink.opacity(text == nil ? 0.35 : 0.8))
                .frame(width: width, height: 4)
        }
        .frame(width: width)
    }
}

struct SquiggleAnswerRow: View {
    let chunks: [String]
    let revealed: Bool
    /// Roughly how wide each chunk's blank should read, from its character
    /// count — mirrors how Figma sized wider blanks for longer chunks.
    private func width(for chunk: String) -> CGFloat {
        max(46, CGFloat(chunk.count) * 24)
    }

    var body: some View {
        FlowWrap(spacing: 18, lineSpacing: 14) {
            ForEach(Array(chunks.enumerated()), id: \.offset) { _, chunk in
                SquiggleAnswer(text: revealed ? chunk : nil, width: width(for: chunk))
            }
        }
    }
}

/// Minimal flow layout so multi-chunk answers (Word 3) wrap onto a second
/// row instead of being force-fit onto one line.
struct FlowWrap: Layout {
    var spacing: CGFloat = 12
    var lineSpacing: CGFloat = 12

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var x: CGFloat = 0, y: CGFloat = 0, lineHeight: CGFloat = 0
        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, x > 0 {
                x = 0
                y += lineHeight + lineSpacing
                lineHeight = 0
            }
            x += size.width + spacing
            lineHeight = max(lineHeight, size.height)
        }
        return CGSize(width: maxWidth.isFinite ? maxWidth : x, height: y + lineHeight)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX, y = bounds.minY, lineHeight: CGFloat = 0
        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX, x > bounds.minX {
                x = bounds.minX
                y += lineHeight + lineSpacing
                lineHeight = 0
            }
            view.place(at: CGPoint(x: x, y: y), anchor: .topLeading, proposal: .unspecified)
            x += size.width + spacing
            lineHeight = max(lineHeight, size.height)
        }
    }
}
