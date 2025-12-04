"use client"

import { useState, useEffect } from "react"
import type { Thread, Category, Store } from "@/lib/types"
import { apiStore } from "@/lib/api-store"
import { CategoryFilter } from "@/components/category-filter"
import { StoreFilter } from "@/components/store-filter"
import { ThreadCard } from "@/components/thread-card"
import { StoreMap } from "@/components/store-map"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | "すべて">("すべて")
  const [selectedStore, setSelectedStore] = useState<Store | "すべて">("すべて")
  const [sortBy, setSortBy] = useState<"latest" | "likes">("latest")
  const [loading, setLoading] = useState(true)
  const [showDescription, setShowDescription] = useState(false)

  const loadThreads = async () => {
    try {
      setLoading(true)
      const loadedThreads = await apiStore.getThreads(selectedCategory, sortBy, selectedStore)
      setThreads(loadedThreads)
    } catch (error) {
      console.error("スレッド読み込みエラー:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadThreads()
  }, [selectedCategory, selectedStore, sortBy])

  const sortedThreads = threads

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 bg-card border-b border-border z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-3 py-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gradient-to-r from-daido-navy to-daido-navy-dark rounded-lg p-1.5 shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-daido-navy">大同みんスパ</h1>
              <p className="text-[10px] text-daido-navy/70 leading-tight">大同大学生のための自炊攻略ログ</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-3">
            <span>愛知県</span>
            <span>＞</span>
            <span>名古屋市南区</span>
            <span>＞</span>
            <span>大同大学エリア</span>
          </div>
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          <div className="mt-3">
            <StoreFilter selected={selectedStore} onSelect={setSelectedStore} />
          </div>
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="w-full mt-3 mb-2 text-xs text-daido-navy/70 hover:text-daido-navy flex items-center justify-center gap-1 py-1"
          >
            {showDescription ? "▲ 閉じる" : "▼ このアプリについて"}
          </button>
          {showDescription && (
            <div className="mb-3 p-3 bg-gradient-to-r from-daido-yellow-light to-yellow-50 border border-daido-yellow rounded-lg">
              <p className="text-xs text-daido-navy leading-relaxed">
                このSNSは、"スーパーで見つけたこと"を気軽に共有できる掲示板です。<br />
                おすすめ商品、値引き情報、混雑状況、小さな発見など、どんなことでもOK！<br />
                みんなの投稿が、毎日の買い物をちょっと便利に、ちょっと楽しくしてくれます。
              </p>
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setSortBy("latest")}
              className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                sortBy === "latest"
                  ? "bg-gradient-to-r from-daido-navy to-daido-navy-dark text-white shadow-md"
                  : "bg-white border border-daido-navy text-daido-navy hover:bg-blue-50"
              }`}
            >
              📅 最新順
            </button>
            <button
              onClick={() => setSortBy("likes")}
              className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                sortBy === "likes"
                  ? "bg-gradient-to-r from-daido-navy to-daido-navy-dark text-white shadow-md"
                  : "bg-white border border-daido-navy text-daido-navy hover:bg-blue-50"
              }`}
            >
              ❤️ いいね順
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 py-3">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        ) : sortedThreads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {selectedCategory === "すべて"
                ? "まだスレッドがありません"
                : `「${selectedCategory}」のスレッドがありません`}
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              最初のスレッドを作成
            </Link>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {sortedThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} onLike={loadThreads} />
            ))}
          </div>
        )}

        {/* Google Maps API キーを設定したら下記のコメントを外してください */}
        {/* <div className="mt-8 mb-6">
          <h2 className="text-lg font-bold text-daido-navy mb-4">📍 対象店舗マップ</h2>
          <StoreMap />
        </div> */}
      </main>

      <Link
        href="/create"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-daido-navy to-daido-navy-dark text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        aria-label="新規スレッド作成"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  )
}
