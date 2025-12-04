import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Thread from "@/models/Thread"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const thread = await Thread.findById(id).lean()

    if (!thread) {
      return NextResponse.json({ error: "スレッドが見つかりません" }, { status: 404 })
    }

    return NextResponse.json({
      id: thread._id.toString(),
      categories: thread.categories,
      store: thread.store,
      nickname: thread.nickname,
      title: thread.title,
      content: thread.content,
      rating: thread.rating,
      media: thread.media,
      replyCount: thread.replyCount,
      likes: thread.likes,
      createdAt: thread.createdAt,
    })
  } catch (error) {
    console.error("スレッド取得エラー:", error)
    return NextResponse.json({ error: "スレッドの取得に失敗しました" }, { status: 500 })
  }
}
