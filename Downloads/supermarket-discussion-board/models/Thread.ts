import mongoose from "mongoose"

const MediaSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true },
  },
  { _id: false }
)

const ThreadSchema = new mongoose.Schema(
  {
    categories: [
      {
        type: String,
        enum: ["肉", "魚", "野菜・果物", "お菓子・飲料", "日用品", "その他"],
      },
    ],
    store: {
      type: String,
      enum: ["ローソン大同工前店", "ピアゴ柴田店", "ヤマナカ柴田店", "ウェルシア名古屋大同店"],
      required: true,
    },
    nickname: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    media: [MediaSchema],
    replyCount: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Thread || mongoose.model("Thread", ThreadSchema)
