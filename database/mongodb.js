import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
const uri = process.env.MONGODB_SERVER

const dbconnect= async()=>{
  try {
    await mongoose.connect(uri)
    console.log("connected")
  } catch (error) {
    console.log(error)
  }
}

export default dbconnect;