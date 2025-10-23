import { NextResponse } from "next/server";
import connectDB from "@/app/utils/database";
import { ItemModel } from "@/app/utils/schemaModels";
import { jwtVerify } from "jose";

export async function PUT(request, context) {
  try {
    // トークンをヘッダーから取得
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "認証ヘッダーがありません" }, { status: 401 });
    }

    // トークンを抽出
    const token = authHeader.split(" ")[1];
    const secretKey = new TextEncoder().encode("next-market-app-book");

    // トークンを検証してemail取得
    const decodedJwt = await jwtVerify(token, secretKey);
    const loginUserEmail = decodedJwt.payload.email;

    // DB接続
    await connectDB();

    // 編集対象を取得
    const singleItem = await ItemModel.findById(context.params.id);
    if (!singleItem) {
      return NextResponse.json({ message: "アイテムが見つかりません" }, { status: 404 });
    }

    // 作成者チェック
    if (singleItem.email !== loginUserEmail) {
      return NextResponse.json({ message: "他の人が作成したアイテムです" }, { status: 403 });
    }

    // リクエスト本文
    const reqBody = await request.json();

    // ✅ emailはフロントから来た値を無視して、ログインユーザーのemailで上書き
    const updatedData = {
      ...reqBody,
      email: loginUserEmail,
    };

    // 更新実行
    await ItemModel.updateOne({ _id: context.params.id }, updatedData);

    return NextResponse.json({ message: "アイテム編集成功" });

  } catch (err) {
    console.error("エラー発生:", err);
    return NextResponse.json({ message: "アイテム編集失敗" }, { status: 500 });
  }
}
