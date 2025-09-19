import { NextResponse } from "next/server"; 
import connectDB from "@/app/utils/database";
import { ItemModel } from "@/app/utils/schemaModels"; 

export async function GET(request, context) {

  try {
    await connectDB();
    const singleItem = await ItemModel.findById(context.params.id)
    return NextResponse.json({
      message: "アイテム読み取り成功 (シングル)",singleItem: singleItem
    })
  } catch  {
    return NextResponse.json(
      { message: "アイテム読み取り失敗 (シングル)" },
      { status: 500 }
    );
  }
}