"use client"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
}

const ratings = [
  { value: 1, emoji: "😞", label: "おすすめしない" },
  { value: 2, emoji: "😊", label: "おすすめ" },
]

export function StarRating({ rating, onRatingChange, readonly = false }: StarRatingProps) {
  // 評価がない場合のデフォルト表示
  if (readonly && rating === 0) return null

  return (
    <div className="flex gap-3 items-center">
      {ratings.map((item) => (
        <button
          key={item.value}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange?.(item.value)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all min-h-[44px] ${
            readonly
              ? "cursor-default"
              : "cursor-pointer hover:scale-105 active:scale-95"
          } ${
            item.value === rating
              ? "bg-daido-yellow border-daido-navy text-daido-navy shadow-md scale-105"
              : "bg-white border-gray-200 text-gray-600 opacity-60"
          }`}
        >
          <span className="text-2xl">{item.emoji}</span>
          <span className="text-sm font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
