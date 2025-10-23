import { NextResponse } from "next/server";
import connectDB from "@/app/utils/database";
import { ItemModel } from "@/app/utils/schemaModels";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    const reqBody = await request.json();

    // JWTを検証
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const secretKey = new TextEncoder().encode("next-market-app-book");
    const decodedJwt = await jwtVerify(token, secretKey);
    console.log("decodedJwt", decodedJwt);

    // DB接続
    await connectDB();

    // emailをJWTから取り出して保存
    const createdItem = await ItemModel.create({
      title: reqBody.title,
      price: reqBody.price,
      image: reqBody.image,
      description: reqBody.description,
      email: decodedJwt.payload.email, // ✅ トークンから取得
    });

    console.log("保存されたアイテム:", createdItem);
    return NextResponse.json({ message: "アイテム作成成功" });

  } catch (err) {
    console.error("エラー発生:", err.message);
    console.error("詳細:", err);
    return NextResponse.json({ message: "アイテム作成失敗", error: err.message });
  }
}
