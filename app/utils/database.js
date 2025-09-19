import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://akidesu:mPVks4AtAZMearz5@cluster0.egabmf1.mongodb.net/nextAppDate?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,    // ← 追加：推奨オプション
        useUnifiedTopology: true, // ← 追加：推奨オプション
      }
    );

    console.log("Success: Connected to MongoDB");
  } catch (error) {
    console.error("Failure: Unconnected to MongoDB", error);  // ← 詳細エラーをログ
    throw error;  // 詳細なエラーを投げる
  }
};


export default connectDB;
//mongodb+srv://akidesu:xxZ4QWIdpVRRnmzb@cluster0.mtm127w.mongodb.net/nextAppDateBase?retryWrites=true&w=majority&appName=Cluster0


//akidesu:mPVks4AtAZMearz5