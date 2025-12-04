"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Category, Media, Store } from "@/lib/types"
import { apiStore } from "@/lib/api-store"
import { handleMediaUpload } from "@/lib/media-utils"
import { StarRating } from "@/components/star-rating"
import { MediaPreview } from "@/components/media-preview"
import { ArrowLeft, ImageIcon, VideoIcon } from "lucide-react"
import Link from "next/link"

const categories: Category[] = ["肉", "魚", "野菜・果物", "お菓子・飲料", "日用品", "その他"]
const stores: Store[] = ["ローソン大同工前店", "ピアゴ柴田店", "ヤマナカ柴田店", "ウェルシア名古屋大同店"]

export default function CreateThread() {
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [store, setStore] = useState<Store>("ローソン大同工前店")
  const [nickname, setNickname] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState<number>(0)
  const [media, setMedia] = useState<Media[]>([])

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await apiStore.saveThread({
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        store,
        nickname: nickname || "名無しさん",
        title,
        content,
        rating: rating > 0 ? rating : undefined,
        media: media.length > 0 ? media : undefined,
      })

      router.push("/")
    } catch (error) {
      console.error("スレッド作成エラー:", error)
      alert("スレッドの作成に失敗しました")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 bg-gradient-to-r from-daido-yellow-light to-yellow-50 border-b-2 border-daido-yellow z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-3 py-3 flex items-center gap-3">
          <Link href="/" className="text-daido-navy hover:text-daido-navy/80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold text-daido-navy">✏️ 新規投稿</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">カテゴリ（任意）</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 px-3 py-2 bg-card border border-input rounded-lg cursor-pointer hover:bg-accent transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="rounded border-input text-primary focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-card-foreground">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              店舗 <span className="text-red-500">*</span>
            </label>
            <select
              value={store}
              onChange={(e) => setStore(e.target.value as Store)}
              className="w-full px-4 py-2 bg-card border border-input rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              {stores.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">ニックネーム</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="名無しさん"
              className="w-full px-4 py-2 bg-card border border-input rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="スレッドのタイトルを入力"
              className="w-full px-4 py-2 bg-card border border-input rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              本文 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="内容を入力してください"
              rows={6}
              className="w-full px-4 py-2 bg-card border border-input rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              評価（任意）
            </label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">画像・動画（任意）</label>
            <div className="flex gap-2 mb-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm">画像</span>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              </label>
              <label className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                <VideoIcon className="h-4 w-4" />
                <span className="text-sm">動画</span>
                <input type="file" accept="video/*" multiple onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <MediaPreview media={media} onRemove={handleRemoveMedia} />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] bg-gradient-to-r from-daido-navy to-daido-navy-dark text-white py-3 rounded-lg font-medium hover:shadow-lg active:scale-[0.98] transition-all"
          >
            📝 投稿する
          </button>
        </form>
      </main>
    </div>
  )
}
