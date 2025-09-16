import mongoose from "mongoose"

const connectDB = () => {
    try{
    
       mongoose.connect("mongodb+srv://akidesu:xxZ4QWIdpVRRnmzb@cluster0.mtm127w.mongodb.net/nextAppDateBase?retryWrites=true&w=majority&appName=Cluster0")
       console.log("Success: Connected to MongoDB")
    }catch{
       console.log("Failure: Unconnented to MongoDB")
       throw new Error()
    }
}

export default connectDB