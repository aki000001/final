import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import connectDB from "@/app/utils/database";
import { UserModel } from "@/app/utils/schemaModels";

export async function POST(request) {
  const reqBody = await request.json();

  try {
    await connectDB();
    const savedUserData = await UserModel.findOne({ email: reqBody.email });

    if (!savedUserData) {
      return NextResponse.json(
        { message: "ログイン失敗：ユーザー登録をしてください" },
        { status: 404 }
      );
    }

    // パスワード照合
    if (reqBody.password === savedUserData.password) {
      const secretKey = new TextEncoder().encode("next-market-app-book");

      // ✅ savedUserData から email を使う
      const payload = {
        email: savedUserData.email,
      };

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(secretKey);

      return NextResponse.json({ message: "ログイン成功", token: token });
    } else {
      return NextResponse.json(
        { message: "ログイン失敗：パスワードが間違っています。" },
        { status: 401 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: "ログイン失敗", error: err.message },
      { status: 500 }
    );
  }
}
