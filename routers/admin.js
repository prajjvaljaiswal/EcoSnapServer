const express = require("express")
const Admin = require("../models/admin")

const adminRouter = express.Router()

adminRouter.post("/register",async(req,res)=>{
    try {
        if(!req.body)
            res.status(400).json({message: "filds are empty"})
        const admin = await new Admin(req.body)
        await admin.save()
        res.status(200).json({admin})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

adminRouter.post("/login",async(req,res)=>{
    try {
        console.log(req.body)
        const admin = await Admin.findOne({email: req.body.email})
        if(!admin)
            res.status(404).json({message: "Error: admin not Found"})
        res.status(200).json({admin})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

module.exports = adminRouter