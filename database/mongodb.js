const dotenv = require("dotenv")
const mongoose = require("mongoose")

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

module.exports = dbconnect;