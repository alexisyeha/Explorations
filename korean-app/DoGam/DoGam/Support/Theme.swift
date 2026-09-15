import SwiftUI

/// Colors and type from the actual Figma file ("Daily Vibe"), not invented.
enum Theme {
    /// #FBF7EB — the exact background used on every frame in the file.
    static let paper = Color(red: 0xFB / 255, green: 0xF7 / 255, blue: 0xEB / 255)

    /// The design uses literal black for text/ink, not a warm-tinted black.
    static let ink = Color.black
    static let inkSoft = Color.black.opacity(0.7)

    static let cardDark = Color(red: 0x3D / 255, green: 0x3D / 255, blue: 0x3B / 255)
    static let bookSpineHighlight = Color(white: 1.0).opacity(0.35)

    /// "DOGAM" wordmark on the welcome screen — Figma: TAY Big Bird.
    static func wordmark(_ size: CGFloat) -> Font {
        customFont("TAYBigBirdRegular", fallback: .rounded, size: size, weight: .bold)
    }

    /// "Word N" titles, tagline, "Can't speak now" — Figma: TAY Birdie.
    static func heading(_ size: CGFloat) -> Font {
        customFont("TAYBirdieRegular", fallback: .rounded, size: size, weight: .medium)
    }

    /// Reading-syllable reveals and book-spine day labels — Figma: SejongGeulggot.
    static func reading(_ size: CGFloat) -> Font {
        customFont("SejongGeulggot", fallback: .serif, size: size, weight: .regular)
    }

    private static func customFont(_ name: String, fallback: Font.Design, size: CGFloat, weight: Font.Weight) -> Font {
        if UIFont(name: name, size: size) != nil {
            return Font.custom(name, size: size)
        }
        return Font.system(size: size, weight: weight, design: fallback)
    }
}
