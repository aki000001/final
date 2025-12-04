"use client"

import type { Thread } from "@/lib/types"
import { StarRating } from "./star-rating"
import { MessageCircle, ImageIcon, Video, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { apiStore } from "@/lib/api-store"
import { useState } from "react"

interface ThreadCardProps {
  thread: Thread
  onLike?: () => void
}

export function ThreadCard({ thread, onLike }: ThreadCardProps) {
  const [likes, setLikes] = useState(thread.likes)
  const hasMedia = thread.media && thread.media.length > 0
  const mediaCount = thread.media?.length || 0
  const hasImages = thread.media?.some((m) => m.type === "image")
  const hasVideos = thread.media?.some((m) => m.type === "video")
  const thumbnail = thread.media?.find((m) => m.type === "image")?.url

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const newLikes = await apiStore.toggleLike(thread.id)
      setLikes(newLikes)
      if (onLike) onLike()
    } catch (error) {
      console.error("いいねエラー:", error)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/thread/${thread.id}`} className="block p-4 pb-0">
        <div className="flex gap-3">
          {/* 左側：テキストコンテンツ */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">{thread.store}</span>
              {thread.categories?.map((cat) => (
                <span key={cat} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                  {cat}
                </span>
              ))}
              <span className="text-xs text-muted-foreground">
                {new Date(thread.createdAt).toLocaleDateString("ja-JP")}
              </span>
            </div>

            <h3 className="font-semibold text-card-foreground mb-1 text-balance line-clamp-1">{thread.title}</h3>

            <p className="text-sm text-muted-foreground mb-2 line-clamp-2 text-pretty">{thread.content}</p>

            {thread.rating && (
              <div className="mb-2">
                <StarRating rating={thread.rating} readonly />
              </div>
            )}
          </div>

          {/* 右側：サムネイル画像 */}
          {thumbnail && (
            <div className="shrink-0">
              <Image
                src={thumbnail}
                alt={thread.title}
                width={100}
                height={100}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </Link>

      <div className="flex items-center justify-between text-xs text-muted-foreground px-4 py-3 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="text-xs">{thread.nickname}</span>
          {hasMedia && (
            <div className="flex items-center gap-1.5">
              {hasImages && (
                <span className="flex items-center gap-0.5">
                  <ImageIcon className="h-3 w-3" />
                  <span className="text-xs">{thread.media?.filter((m) => m.type === "image").length}</span>
                </span>
              )}
              {hasVideos && (
                <span className="flex items-center gap-0.5">
                  <Video className="h-3 w-3" />
                  <span className="text-xs">{thread.media?.filter((m) => m.type === "video").length}</span>
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-full bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 text-red-600 hover:from-red-500 hover:to-pink-500 hover:text-white hover:shadow-sm transition-all active:scale-95"
          >
            <Heart className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{likes}</span>
          </button>
          <Link
            href={`/thread/${thread.id}`}
            className="flex items-center gap-1 px-2 py-1 min-h-[36px] text-gray-600 hover:text-gray-900"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="text-xs">{thread.replyCount}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
