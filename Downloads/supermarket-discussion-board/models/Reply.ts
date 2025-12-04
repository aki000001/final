import mongoose from "mongoose"

const MediaSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true },
  },
  { _id: false }
)

const ReplySchema = new mongoose.Schema(
  {
    threadId: { type: String, required: true, index: true },
    nickname: { type: String, required: true },
    content: { type: String, required: true },
    media: [MediaSchema],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Reply || mongoose.model("Reply", ReplySchema)
