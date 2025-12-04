import type { Thread, Reply, Category } from "./types"

const THREADS_KEY = "supermarket_threads"
const REPLIES_KEY = "supermarket_replies"

export const storage = {
  getThreads(): Thread[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(THREADS_KEY)
    return data ? JSON.parse(data) : []
  },

  saveThread(thread: Thread): void {
    const threads = this.getThreads()
    threads.unshift(thread)
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads))
  },

  updateThreadReplyCount(threadId: string): void {
    const threads = this.getThreads()
    const thread = threads.find((t) => t.id === threadId)
    if (thread) {
      thread.replyCount += 1
      localStorage.setItem(THREADS_KEY, JSON.stringify(threads))
    }
  },

  getThread(id: string): Thread | undefined {
    return this.getThreads().find((t) => t.id === id)
  },

  getReplies(threadId: string): Reply[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(REPLIES_KEY)
    const allReplies: Reply[] = data ? JSON.parse(data) : []
    return allReplies.filter((r) => r.threadId === threadId)
  },

  saveReply(reply: Reply): void {
    const replies = typeof window === "undefined" ? [] : JSON.parse(localStorage.getItem(REPLIES_KEY) || "[]")
    replies.push(reply)
    localStorage.setItem(REPLIES_KEY, JSON.stringify(replies))
    this.updateThreadReplyCount(reply.threadId)
  },

  filterByCategory(threads: Thread[], category: Category | "すべて"): Thread[] {
    if (category === "すべて") return threads
    return threads.filter((t) => t.categories?.includes(category))
  },

  toggleLike(threadId: string): void {
    const threads = this.getThreads()
    const thread = threads.find((t) => t.id === threadId)
    if (thread) {
      thread.likes += 1
      localStorage.setItem(THREADS_KEY, JSON.stringify(threads))
    }
  },

  sortThreads(threads: Thread[], sortBy: "latest" | "likes"): Thread[] {
    if (sortBy === "likes") {
      return [...threads].sort((a, b) => b.likes - a.likes)
    }
    return threads // デフォルトは最新順（既にgetThreadsで逆順になっている）
  },
}
