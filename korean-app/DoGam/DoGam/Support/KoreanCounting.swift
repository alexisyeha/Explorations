import Foundation

/// Native Korean counting numbers, used as the day-counter label on each
/// collected book's spine (Figma 45:970 shows "하나" — day one).
enum KoreanCounting {
    private static let words = [
        "하나", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉", "열",
    ]

    static func word(for day: Int) -> String {
        guard day >= 1 else { return words[0] }
        if day <= words.count { return words[day - 1] }
        return "\(day)"
    }
}
