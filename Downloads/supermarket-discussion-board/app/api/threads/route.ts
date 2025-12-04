import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Thread from "@/models/Thread"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const store = searchParams.get("store")
    const sortBy = searchParams.get("sortBy") || "latest"

    let query: any = {}
    if (category && category !== "すべて") {
      query.categories = category
    }
    if (store && store !== "すべて") {
      query.store = store
    }

    let threads
    if (sortBy === "likes") {
      threads = await Thread.find(query).sort({ likes: -1 }).lean()
    } else {
      threads = await Thread.find(query).sort({ createdAt: -1 }).lean()
    }

    // MongoDBの_idをidに変換
    const formattedThreads = threads.map((thread) => ({
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
      createdAt: thread.createdAt || thread.createdAt,
    }))

    return NextResponse.json(formattedThreads)
  } catch (error) {
    console.error("スレッド取得エラー:", error)
    return NextResponse.json({ error: "スレッドの取得に失敗しました" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const thread = await Thread.create({
      categories: body.categories,
      store: body.store,
      nickname: body.nickname || "名無しさん",
      title: body.title,
      content: body.content,
      rating: body.rating,
      media: body.media,
      replyCount: 0,
      likes: 0,
    })

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
    console.error("スレッド作成エラー:", error)
    return NextResponse.json({ error: "スレッドの作成に失敗しました" }, { status: 500 })
  }
}
