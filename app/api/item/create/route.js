import { NextResponse } from "next/server";
import connectDB from "@/app/utils/database";
import { ItemModel } from "@/app/utils/schemaModels";  // ← ここを追加してItemModelをインポート

export async function POST(request) {
  const reqBody = await request.json();

  try {
    await connectDB();
    const createdItem = await ItemModel.create(reqBody);
    console.log("保存されたアイテム:", createdItem);  // 保存結果もログに出す
    return NextResponse.json({ message: "アイテム作成成功" });
  } catch (err) {
    console.error("エラー発生:", err);  // エラー内容を詳しくログ
    return NextResponse.json({ message: "アイテム作成失敗" });
  }
}

