import SwiftUI

/// Every frame in the Figma file was designed at 402×874 (iPhone Pro point
/// size) with its own mock status bar baked in. This scales that fixed
/// canvas to fit whatever device it actually runs on, so the absolute
/// coordinates pulled from Figma stay correct instead of being re-derived
/// per screen size.
struct FigmaScreen<Content: View>: View {
    static var designSize: CGSize { CGSize(width: 402, height: 874) }

    @ViewBuilder let content: Content

    var body: some View {
        GeometryReader { geo in
            let scale = geo.size.width / Self.designSize.width
            ZStack(alignment: .top) {
                Theme.paper
                content
                    .frame(width: Self.designSize.width, height: Self.designSize.height, alignment: .top)
                    .scaleEffect(scale, anchor: .top)
            }
            .frame(width: geo.size.width, height: geo.size.height, alignment: .top)
        }
        .ignoresSafeArea()
    }
}

/// Absolute placement helper matching Figma's `left`/`top` layout — pass the
/// node's x/y/width/height straight from the design-context output.
extension View {
    func figmaFrame(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) -> some View {
        self
            .frame(width: width, height: height)
            .position(x: x + width / 2, y: y + height / 2)
    }
}
