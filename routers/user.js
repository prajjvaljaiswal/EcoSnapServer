import express from "express"
import User from "../models/user.js"

const userRouter = express.Router()

userRouter.post("/create",async(req, res)=>{
    try {
        console.log(req.body)
        const {name, email, password} = req.body
        if(!req.body)
            res.status(400).json({message: "Error: enter data"})
        const user = await new User({name,email,password})
        await user.save()
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

userRouter.post("/login", async(req, res)=>{
    try {
        console.log(req.body)
        const user = await User.findOne({email: req.body.email})
        if(!user)
            res.status(404).json({message: "Error: User not Found"})
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

userRouter.get("/profile", async(req, res)=>{
    try {
        const id = req.query.id
        if(!id)
            res.status(400).json({message: "Error: Enter id"})
        const user = await User.findOne({email: id})
        if(!user)
            res.status(404).json({message: "Error: User not found"})
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

userRouter.get("/points",async(req, res)=>{
    try {
        const users = await User.getUsersSortedByPoints()
        if(!users)
            res.status(404).json({message: "Error: User not found"})
        res.status(200).json({users})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

userRouter.put("/profile/update", async(req, res)=>{
    try {
        const {id} = req.query
        const user = await User.findOne({email: id})
        if(!user)
            res.status(404).json({message: "Error: User not found"})
        const update = await User.updateOne({_id:user._id},req.body)
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

export default userRouter