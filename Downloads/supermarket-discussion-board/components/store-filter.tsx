"use client"

import type { Store } from "@/lib/types"

interface StoreFilterProps {
  selected: Store | "すべて"
  onSelect: (store: Store | "すべて") => void
}

const stores = ["すべて", "ローソン大同工前店", "ピアゴ柴田店", "ヤマナカ柴田店", "ウェルシア名古屋大同店"] as const

export function StoreFilter({ selected, onSelect }: StoreFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {stores.map((store) => (
        <button
          key={store}
          onClick={() => onSelect(store)}
          className={`
            shrink-0 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-colors
            ${
              selected === store
                ? "bg-daido-yellow text-daido-navy border-2 border-daido-navy"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }
          `}
        >
          {store}
        </button>
      ))}
    </div>
  )
}
