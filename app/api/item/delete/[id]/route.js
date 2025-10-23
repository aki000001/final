import { NextResponse } from "next/server";
import connectDB from "@/app/utils/database";
import { ItemModel } from "@/app/utils/schemaModels";
import { jwtVerify } from "jose";

export async function DELETE(request, context) {
  try {
    // トークンをヘッダーから取得
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "認証エラー：トークンがありません" }, { status: 401 });
    }

    // JWT検証
    const secretKey = new TextEncoder().encode("next-market-app-book");
    const decodedJwt = await jwtVerify(token, secretKey);
    const userEmail = decodedJwt.payload.email;

    // MongoDB接続
    await connectDB();

    // アイテムを取得
    const singleItem = await ItemModel.findById(context.params.id);
    if (!singleItem) {
      return NextResponse.json({ message: "アイテムが存在しません" }, { status: 404 });
    }

    // 作成者チェック
    if (singleItem.email === userEmail) {
      await ItemModel.deleteOne({ _id: context.params.id });
      return NextResponse.json({ message: "アイテム削除成功" });
    } else {
      return NextResponse.json({ message: "他の人が作成したアイテムです" }, { status: 403 });
    }
  } catch (err) {
    console.error("削除エラー:", err);
    return NextResponse.json({ message: "アイテム削除失敗", error: err.message }, { status: 500 });
  }
}
