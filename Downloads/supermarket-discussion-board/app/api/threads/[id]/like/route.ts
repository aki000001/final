import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Thread from "@/models/Thread"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const thread = await Thread.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    ).lean()

    if (!thread) {
      return NextResponse.json({ error: "スレッドが見つかりません" }, { status: 404 })
    }

    return NextResponse.json({ likes: thread.likes })
  } catch (error) {
    console.error("いいねエラー:", error)
    return NextResponse.json({ error: "いいねに失敗しました" }, { status: 500 })
  }
}
