"use client"

import type { Media } from "@/lib/types"
import { X } from "lucide-react"
import Image from "next/image"

interface MediaPreviewProps {
  media: Media[]
  onRemove?: (id: string) => void
  readonly?: boolean
}

export function MediaPreview({ media, onRemove, readonly = false }: MediaPreviewProps) {
  if (media.length === 0) return null

  return (
    <div className="flex gap-2 flex-wrap">
      {media.map((item) => (
        <div key={item.id} className="relative group">
          {item.type === "image" ? (
            <Image
              src={item.url || "/placeholder.svg"}
              alt="Upload preview"
              width={100}
              height={100}
              className="w-24 h-24 object-cover rounded-lg"
            />
          ) : (
            <video src={item.url} className="w-24 h-24 object-cover rounded-lg" controls />
          )}
          {!readonly && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="absolute -top-2 -right-2 bg-foreground text-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
