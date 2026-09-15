import SwiftUI

struct ContentView: View {
    private let pages = DemoPage.samples
    private let curlOverscan: CGFloat = 118

    @State private var pageIndex = 0
    @State private var curlProgress: CGFloat = 0
    @State private var dragPoint = CGPoint(x: 1, y: 1)
    @State private var isFinishingTurn = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        GeometryReader { proxy in
            let pageSize = CGSize(
                width: min(330, proxy.size.width - 44),
                height: min(500, proxy.size.height * 0.62)
            )

            VStack(spacing: 0) {
                VStack(spacing: 7) {
                    Text("PAGE CURL")
                        .font(.caption.weight(.semibold))
                        .tracking(2.4)
                    Text("Pull the lower-right corner")
                        .font(.title3)
                    Text("Release past the midpoint to turn the page.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
                .padding(.top, 34)

                Spacer(minLength: 24)

                ZStack {
                    page(pages[nextIndex], number: nextIndex + 1, size: pageSize)
                        .offset(x: 3, y: 4)
                        .rotationEffect(.degrees(0.45))
                        .shadow(color: .black.opacity(0.14), radius: 18, y: 10)

                    page(pages[pageIndex], number: pageIndex + 1, size: pageSize)
                        .physicalPageCurl(
                            progress: curlProgress,
                            dragPoint: dragPoint,
                            pageSize: pageSize,
                            overscan: curlOverscan
                        )
                        .allowsHitTesting(false)
                }
                .frame(width: pageSize.width, height: pageSize.height)
                .contentShape(Rectangle())
                .gesture(pageTurnGesture(in: pageSize))
                .allowsHitTesting(!isFinishingTurn)
                .accessibilityElement(children: .contain)
                .accessibilityLabel("Page \(pageIndex + 1) of \(pages.count)")
                .accessibilityHint("Drag inward from the lower right corner to turn")

                Spacer(minLength: 20)

                HStack(spacing: 7) {
                    ForEach(pages.indices, id: \.self) { index in
                        Capsule()
                            .fill(index == pageIndex ? Color.primary : Color.primary.opacity(0.18))
                            .frame(width: index == pageIndex ? 24 : 7, height: 7)
                    }
                }
                .animation(.snappy, value: pageIndex)
                .padding(.bottom, 30)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .background(Color(red: 0.984, green: 0.969, blue: 0.922))
        .sensoryFeedback(.impact(weight: .light, intensity: 0.75), trigger: pageIndex)
    }

    private var nextIndex: Int {
        (pageIndex + 1) % pages.count
    }

    private func page(_ page: DemoPage, number: Int, size: CGSize) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(page.kicker)
                .font(.caption.weight(.semibold))
                .tracking(1.5)
                .foregroundStyle(page.accent)

            Text(page.title)
                .font(.system(.largeTitle, design: .serif, weight: .medium))
                .padding(.top, 12)

            Rectangle()
                .fill(page.accent)
                .frame(width: 42, height: 2)
                .padding(.vertical, 28)

            Text(page.body)
                .font(.system(.body, design: .serif))
                .lineSpacing(7)
                .foregroundStyle(.primary.opacity(0.82))

            Spacer()

            HStack {
                Text(page.footnote)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Spacer()
                Text("\(number)")
                    .font(.system(.callout, design: .monospaced).weight(.medium))
            }
        }
        .padding(30)
        .frame(width: size.width, height: size.height, alignment: .topLeading)
        .background(
            ZStack {
                Color(red: 0.995, green: 0.988, blue: 0.958)
                Canvas { context, canvasSize in
                    for row in stride(from: 12.0, through: canvasSize.height, by: 18.0) {
                        let path = Path(CGRect(x: 0, y: row, width: canvasSize.width, height: 0.45))
                        context.fill(path, with: .color(.black.opacity(0.018)))
                    }
                }
            }
        )
        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 10, style: .continuous)
                .stroke(Color.black.opacity(0.12), lineWidth: 0.75)
        )
    }

    private func pageTurnGesture(in size: CGSize) -> some Gesture {
        DragGesture(minimumDistance: 2, coordinateSpace: .local)
            .onChanged { value in
                guard value.startLocation.x > size.width * 0.55,
                      value.startLocation.y > size.height * 0.48 else { return }

                let dx = max(0, size.width - value.location.x)
                let dy = max(0, size.height - value.location.y)
                let diagonal = hypot(size.width, size.height)
                curlProgress = min(1, hypot(dx, dy) / (diagonal * 0.76))
                dragPoint = CGPoint(
                    x: min(1.08, max(-0.35, value.location.x / size.width)),
                    y: min(1.08, max(-0.35, value.location.y / size.height))
                )
            }
            .onEnded { value in
                guard value.startLocation.x > size.width * 0.55,
                      value.startLocation.y > size.height * 0.48 else { return }

                let predictedDX = size.width - value.predictedEndLocation.x
                let predictedDY = size.height - value.predictedEndLocation.y
                let predicted = hypot(max(0, predictedDX), max(0, predictedDY))
                    / (hypot(size.width, size.height) * 0.76)

                if max(curlProgress, predicted) > 0.42 {
                    finishPageTurn()
                } else {
                    let returnAnimation: Animation = reduceMotion
                        ? .easeOut(duration: 0.16)
                        : .interactiveSpring(response: 0.42, dampingFraction: 0.82)
                    withAnimation(returnAnimation) {
                        curlProgress = 0
                        dragPoint = CGPoint(x: 1, y: 1)
                    }
                }
            }
    }

    private func finishPageTurn() {
        isFinishingTurn = true
        let finishAnimation: Animation = reduceMotion
            ? .easeOut(duration: 0.18)
            : .easeInOut(duration: 0.52)
        withAnimation(finishAnimation) {
            curlProgress = 1
            dragPoint = CGPoint(x: -1, y: -1)
        } completion: {
            pageIndex = nextIndex
            curlProgress = 0
            dragPoint = CGPoint(x: 1, y: 1)
            isFinishingTurn = false
        }
    }
}

private struct DemoPage {
    let kicker: String
    let title: String
    let body: String
    let footnote: String
    let accent: Color

    static let samples = [
        DemoPage(
            kicker: "FIELD NOTE 01",
            title: "양촌",
            body: "A page should feel less like a panel disappearing and more like a small physical decision: lift, bend, then let the paper carry its own momentum.",
            footnote: "yangchon",
            accent: Color(red: 0.66, green: 0.18, blue: 0.15)
        ),
        DemoPage(
            kicker: "FIELD NOTE 02",
            title: "시골밥상",
            body: "The curl is rendered as a half-cylinder. Artwork compresses into the highlight, reverses on the underside, and reveals the next sheet below.",
            footnote: "sigol bapsang",
            accent: Color(red: 0.18, green: 0.38, blue: 0.31)
        ),
        DemoPage(
            kicker: "FIELD NOTE 03",
            title: "한 장 더",
            body: "Because the effect is a native SwiftUI layer shader, the gesture stays responsive and the GPU performs the per-pixel deformation at display refresh rate.",
            footnote: "one more page",
            accent: Color(red: 0.20, green: 0.31, blue: 0.55)
        ),
    ]
}

private struct PhysicalPageCurl: ViewModifier {
    let progress: CGFloat
    let dragPoint: CGPoint
    let pageSize: CGSize
    let overscan: CGFloat

    func body(content: Content) -> some View {
        content
            .padding(overscan)
            .compositingGroup()
            .layerEffect(
                ShaderLibrary.default.pageCurl(
                    .boundingRect,
                    .float(Float(overscan)),
                    .float2(pageSize),
                    .float2(dragPoint),
                    .float(Float(progress)),
                    .color(Color(red: 0.995, green: 0.988, blue: 0.958))
                ),
                maxSampleOffset: CGSize(
                    width: pageSize.width + overscan,
                    height: pageSize.height + overscan
                ),
                isEnabled: progress > 0.0001
            )
    }
}

private extension View {
    func physicalPageCurl(
        progress: CGFloat,
        dragPoint: CGPoint,
        pageSize: CGSize,
        overscan: CGFloat
    ) -> some View {
        modifier(
            PhysicalPageCurl(
                progress: min(max(progress, 0), 1),
                dragPoint: dragPoint,
                pageSize: pageSize,
                overscan: overscan
            )
        )
    }
}

#Preview {
    ContentView()
}
