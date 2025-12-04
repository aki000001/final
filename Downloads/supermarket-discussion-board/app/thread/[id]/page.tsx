"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { Thread, Reply, Media } from "@/lib/types"
import { apiStore } from "@/lib/api-store"
import { handleMediaUpload } from "@/lib/media-utils"
import { StarRating } from "@/components/star-rating"
import { MediaPreview } from "@/components/media-preview"
import { ArrowLeft, MessageCircle, ImageIcon, VideoIcon, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ThreadPage() {
  const params = useParams()
  const [thread, setThread] = useState<Thread | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [nickname, setNickname] = useState("")
  const [content, setContent] = useState("")
  const [media, setMedia] = useState<Media[]>([])
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      const threadId = params.id as string
      const loadedThread = await apiStore.getThread(threadId)
      const loadedReplies = await apiStore.getReplies(threadId)

      setThread(loadedThread || null)
      setReplies(loadedReplies)
      setLikes(loadedThread?.likes || 0)
    }
    loadData()
  }, [params.id])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const uploads = Array.from(files).map(handleMediaUpload)
    const newMedia = await Promise.all(uploads)
    setMedia([...media, ...newMedia])
  }

  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter((m) => m.id !== id))
  }

  const handleLike = async () => {
    if (!thread) return
    try {
      const newLikes = await apiStore.toggleLike(thread.id)
      setLikes(newLikes)
      setThread({ ...thread, likes: newLikes })
    } catch (error) {
      console.error("いいねエラー:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const reply = await apiStore.saveReply({
        threadId: params.id as string,
        nickname: nickname || "名無しさん",
        content,
        media: media.length > 0 ? media : undefined,
      })

      setReplies([...replies, reply])
      setNickname("")
      setContent("")
      setMedia([])

      // Update thread reply count in state
      if (thread) {
        setThread({ ...thread, replyCount: thread.replyCount + 1 })
      }
    } catch (error) {
      console.error("返信作成エラー:", error)
      alert("返信の作成に失敗しました")
    }
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">スレッドが見つかりません</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 bg-gradient-to-r from-daido-yellow-light to-yellow-50 border-b-2 border-daido-yellow z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-3 py-3 flex items-center gap-3">
          <Link href="/" className="text-daido-navy hover:text-daido-navy/80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-bold text-daido-navy line-clamp-1 text-balance">{thread.title}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 py-3">
        {/* Original Post */}
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">{thread.store}</span>
            {thread.categories?.map((cat) => (
              <span key={cat} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                {cat}
              </span>
            ))}
            <span className="text-xs text-muted-foreground">{new Date(thread.createdAt).toLocaleString("ja-JP")}</span>
          </div>

          <h2 className="text-lg font-bold text-card-foreground mb-2 text-balance">{thread.title}</h2>

          <p className="text-sm text-card-foreground mb-3 whitespace-pre-wrap text-pretty">{thread.content}</p>

          {thread.rating && (
            <div className="mb-3">
              <StarRating rating={thread.rating} readonly />
            </div>
          )}

          {thread.media && thread.media.length > 0 && (
            <div className="mb-3">
              <div className="flex gap-2 flex-wrap">
                {thread.media.map((item) => (
                  <div key={item.id}>
                    {item.type === "image" ? (
                      <Image
                        src={item.url || "/placeholder.svg"}
                        alt="Thread media"
                        width={200}
                        height={200}
                        className="w-full max-w-xs rounded-lg"
                      />
                    ) : (
                      <video src={item.url} className="w-full max-w-xs rounded-lg" controls />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>{thread.nickname}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{thread.replyCount}件の返信</span>
              </div>
            </div>
            <button
              onClick={handleLike}
              className="flex items-center gap-1 px-4 py-2 min-h-[40px] bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 text-red-600 rounded-full hover:from-red-500 hover:to-pink-500 hover:text-white hover:shadow-md transition-all active:scale-95"
            >
              <Heart className="h-4 w-4" />
              <span className="font-medium">{likes}</span>
            </button>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-3 mb-4">
          {replies.map((reply, index) => (
            <div key={reply.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                <span className="text-xs text-muted-foreground">{reply.nickname}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(reply.createdAt).toLocaleString("ja-JP")}
                </span>
              </div>

              <p className="text-sm text-card-foreground mb-2 whitespace-pre-wrap text-pretty">{reply.content}</p>

              {reply.media && reply.media.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {reply.media.map((item) => (
                    <div key={item.id}>
                      {item.type === "image" ? (
                        <Image
                          src={item.url || "/placeholder.svg"}
                          alt="Reply media"
                          width={150}
                          height={150}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <video src={item.url} className="w-32 h-32 object-cover rounded-lg" controls />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-semibold text-card-foreground mb-4">返信する</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="ニックネーム（任意）"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="返信内容を入力"
                rows={4}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                required
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <label className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors text-sm">
                <ImageIcon className="h-4 w-4" />
                画像
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              </label>
              <label className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors text-sm">
                <VideoIcon className="h-4 w-4" />
                動画
                <input type="file" accept="video/*" multiple onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {media.length > 0 && <MediaPreview media={media} onRemove={handleRemoveMedia} />}

            <button
              type="submit"
              className="w-full min-h-[48px] bg-gradient-to-r from-daido-navy to-daido-navy-dark text-white py-3 rounded-lg font-medium hover:shadow-lg active:scale-[0.98] transition-all"
            >
              💬 返信する
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
