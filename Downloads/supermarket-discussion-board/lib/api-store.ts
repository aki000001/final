import type { Thread, Reply, Category, Store } from "./types"

export const apiStore = {
  async getThreads(category?: Category | "すべて", sortBy?: "latest" | "likes", store?: Store | "すべて"): Promise<Thread[]> {
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    if (sortBy) params.append("sortBy", sortBy)
    if (store) params.append("store", store)

    const response = await fetch(`/api/threads?${params.toString()}`)
    if (!response.ok) throw new Error("スレッドの取得に失敗しました")
    return response.json()
  },

  async saveThread(thread: Omit<Thread, "id" | "replyCount" | "likes" | "createdAt">): Promise<Thread> {
    const response = await fetch("/api/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(thread),
    })
    if (!response.ok) throw new Error("スレッドの作成に失敗しました")
    return response.json()
  },

  async getThread(id: string): Promise<Thread | null> {
    const response = await fetch(`/api/threads/${id}`)
    if (!response.ok) return null
    return response.json()
  },

  async toggleLike(threadId: string): Promise<number> {
    const response = await fetch(`/api/threads/${threadId}/like`, {
      method: "POST",
    })
    if (!response.ok) throw new Error("いいねに失敗しました")
    const data = await response.json()
    return data.likes
  },

  async getReplies(threadId: string): Promise<Reply[]> {
    const response = await fetch(`/api/threads/${threadId}/replies`)
    if (!response.ok) throw new Error("返信の取得に失敗しました")
    return response.json()
  },

  async saveReply(reply: Omit<Reply, "id" | "createdAt">): Promise<Reply> {
    const response = await fetch(`/api/threads/${reply.threadId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reply),
    })
    if (!response.ok) throw new Error("返信の作成に失敗しました")
    return response.json()
  },
}
