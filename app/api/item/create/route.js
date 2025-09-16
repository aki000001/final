import { NextResponse } from "next/server"
import connectDB from "@/app/utils/database"   

export async function POST(request) {
    console.log(await request.json())
    connectDB()
    return NextResponse.json({message: "アイテム作成"})
}



