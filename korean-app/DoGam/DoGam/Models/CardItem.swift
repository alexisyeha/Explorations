import Foundation

/// One reading card, matching the Figma "Word N" frames exactly.
struct CardItem: Identifiable {
    let id: String
    let title: String
    /// Asset name of the processed, transparent-background ink PNG.
    let imageName: String
    /// Card-border rotation in degrees, taken from the Figma frame.
    let rotationDegrees: Double
    /// Card size in points, taken from the Figma frame (two sizes recur:
    /// a compact one for Word 1/2, a taller one for Word 3/4).
    let cardSize: CGSize
    /// One fill-in-the-blank chunk per squiggle in the Figma frame. Most
    /// words are a single whole-word chunk; only the hardest-to-read card
    /// (Word 1, in TAY-brush style) splits into separate syllables, matching
    /// the two-slot layout actually drawn in the Figma reveal frame.
    let answerChunks: [String]
    let meaning: String
    /// True when the transcription/meaning hasn't been confirmed against the
    /// original source — surfaced instead of asserting a guess as fact.
    let needsReview: Bool

    static let deck: [CardItem] = [
        CardItem(
            id: "word1",
            title: "Word 1",
            imageName: "CardWord1",
            rotationDegrees: -1.4,
            cardSize: CGSize(width: 308, height: 189),
            answerChunks: ["양", "촌"],
            meaning: "Yangchon — read as confirmed in the source design.",
            needsReview: false
        ),
        CardItem(
            id: "word2",
            title: "Word 2",
            imageName: "CardSigolBapsang",
            rotationDegrees: 10.5,
            cardSize: CGSize(width: 308, height: 189),
            answerChunks: ["시골밥상"],
            meaning: "\"Country-style meal table\" — a common restaurant name for home-style rustic Korean cooking.",
            needsReview: false
        ),
        CardItem(
            id: "word3",
            title: "Word 3",
            imageName: "CardBluepen",
            rotationDegrees: -9.4,
            cardSize: CGSize(width: 309, height: 223),
            answerChunks: ["공주산", "나뭇잎이다", "가늘하니라"],
            meaning: "A short personal note in cursive blue pen — transcription is a best-effort guess and needs confirming.",
            needsReview: true
        ),
        CardItem(
            id: "word4",
            title: "Word 4",
            imageName: "CardBaechu",
            rotationDegrees: 7.1,
            cardSize: CGSize(width: 309, height: 223),
            answerChunks: ["배추씨만"],
            meaning: "\"Napa cabbage seed(s) only\" — 배추씨 (napa cabbage seed) + 만 (only).",
            needsReview: false
        ),
        CardItem(
            id: "word4-alt",
            title: "Word 4",
            imageName: "CardIdiosyncratic",
            rotationDegrees: -5.5,
            cardSize: CGSize(width: 309, height: 223),
            answerChunks: ["여기", "웃는소리"],
            meaning: "Loose, highly personal handwriting on ledger paper — not yet confidently transcribed.",
            needsReview: true
        ),
    ]
}
