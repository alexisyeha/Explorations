import SwiftUI

/// Orchestrates the whole flow:
/// home (still life) → tap the pulsing, darkened book → book cover →
/// card 1 → card 2 → … → end → back to home, book settled on the shelf.
struct HomeView: View {
    private enum Stage: Equatable {
        case home
        case cover
        case card(Int)
        case end
    }

    @State private var hasStarted = false
    @State private var completedDays = 0
    @State private var stage: Stage = .home

    private let deck = CardItem.deck
    private let fullImageHeight: CGFloat = 579
    private let minRevealFraction: CGFloat = 0.5

    var body: some View {
        ZStack {
            if !hasStarted {
                WelcomeView(onStart: beginFirstSession)
                    .transition(.opacity)
            } else {
                stillLifeHome
            }

            switch stage {
            case .home:
                EmptyView()
            case .cover:
                BookCoverScreen(day: completedDays + 1, onOpen: { stage = .card(0) })
                    .transition(.move(edge: .bottom))
                    .zIndex(1)
            case .card(let index):
                WordCardScreen(card: deck[index], onFinished: { advance(from: index) })
                    .transition(.move(edge: .bottom))
                    .zIndex(1)
            case .end:
                SessionEndScreen(day: completedDays + 1, onDone: finishToday)
                    .transition(.opacity)
                    .zIndex(1)
            }
        }
        .animation(.spring(response: 0.45, dampingFraction: 0.86), value: stage)
    }

    private var revealFraction: CGFloat {
        let progress = CGFloat(completedDays) / CGFloat(max(deck.count, 1))
        return minRevealFraction + (1 - minRevealFraction) * min(progress, 1)
    }

    private var stillLifeHome: some View {
        FigmaScreen {
            VStack {
                Spacer()
                ZStack(alignment: .bottom) {
                    Image("StillLife")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 172)
                        .frame(height: fullImageHeight * revealFraction, alignment: .bottom)
                        .clipped()

                    if stage == .home {
                        PulsingBookBadge()
                            .offset(y: -60)
                            .onTapGesture(perform: openTodaysBook)
                    }
                }
                Spacer()
            }
        }
    }

    private func beginFirstSession() {
        withAnimation { hasStarted = true }
        openTodaysBook()
    }

    private func openTodaysBook() {
        guard stage == .home else { return }
        stage = .cover
    }

    private func advance(from index: Int) {
        if index + 1 < deck.count {
            stage = .card(index + 1)
        } else {
            stage = .end
        }
    }

    private func finishToday() {
        completedDays += 1
        stage = .home
    }
}

/// The still-life object that pulses with a darkening overlay to mark it as
/// today's tap target — Alex's note: "a slight overlay on one of the books".
private struct PulsingBookBadge: View {
    @State private var pulse = false

    var body: some View {
        Circle()
            .fill(Color.black.opacity(0.22))
            .frame(width: 96, height: 64)
            .scaleEffect(pulse ? 1.08 : 0.94)
            .opacity(pulse ? 0.85 : 0.5)
            .animation(.easeInOut(duration: 1.1).repeatForever(autoreverses: true), value: pulse)
            .onAppear { pulse = true }
            .contentShape(Rectangle())
    }
}

#Preview {
    HomeView()
}
