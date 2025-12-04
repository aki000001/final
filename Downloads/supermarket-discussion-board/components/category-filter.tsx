"use client"

import type { Category } from "@/lib/types"

interface CategoryFilterProps {
  selected: Category | "すべて"
  onSelect: (category: Category | "すべて") => void
}

const categories = ["すべて", "肉", "魚", "野菜・果物", "お菓子・飲料", "日用品", "その他"] as const

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`
            shrink-0 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-colors
            ${
              selected === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
