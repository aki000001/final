import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Reply from "@/models/Reply"
import Thread from "@/models/Thread"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const replies = await Reply.find({ threadId: id }).sort({ createdAt: 1 }).lean()

    const formattedReplies = replies.map((reply) => ({
      id: reply._id.toString(),
      threadId: reply.threadId,
      nickname: reply.nickname,
      content: reply.content,
      media: reply.media,
      createdAt: reply.createdAt,
    }))

    return NextResponse.json(formattedReplies)
  } catch (error) {
    console.error("返信取得エラー:", error)
    return NextResponse.json({ error: "返信の取得に失敗しました" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const body = await request.json()

    const reply = await Reply.create({
      threadId: id,
      nickname: body.nickname || "名無しさん",
      content: body.content,
      media: body.media,
    })

    // スレッドの返信数を増やす
    await Thread.findByIdAndUpdate(id, { $inc: { replyCount: 1 } })

    return NextResponse.json({
      id: reply._id.toString(),
      threadId: reply.threadId,
      nickname: reply.nickname,
      content: reply.content,
      media: reply.media,
      createdAt: reply.createdAt,
    })
  } catch (error) {
    console.error("返信作成エラー:", error)
    return NextResponse.json({ error: "返信の作成に失敗しました" }, { status: 500 })
  }
}
