import express from "express"
import Worker from "../models/worker.js"
import mongoose from "mongoose"

const workerRouter = express.Router()

workerRouter.post("/create",async(req,res)=>{
    try {
        if(!req.body)
            res.status(400).json({message: "filds are empty"})
        const worker = await new Worker(req.body)
        await worker.save()
        res.status(200).json({worker})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

workerRouter.post("/login",async(req,res)=>{
    try {
        console.log(req.body)
        const worker = await Worker.findOne({email: req.body.email})
        if(!worker)
            res.status(404).json({message: "Error: worker not Found"})
        res.status(200).json({worker})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

workerRouter.get("/all",async(req,res)=>{
    try {
        const worker = await Worker.find()
        if(!worker)
            res.status(404).json({message: "Error: worker not found"})
        res.status(200).json({worker})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

workerRouter.get("/from",async(req,res)=>{
    try {
        const {id} = req.query
        let worker;
        if(id)
            {worker = await Worker.findOne({email: id})}
        if(!worker)
            res.status(404).json({message: " worker not found"})
        res.status(200).json({worker})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

workerRouter.put("/assign",async(req, res)=>{
    try {
        const email = req.query.id
        const worker = await Worker.findOne({email})
        const reportId = req.body.reportsAssigned.map(report => 
            new mongoose.Types.ObjectId(report)
          );
        if(!worker)
            res.status(404).json({message: "Error: report not found"})
        worker.reportsAssigned.push(...reportId)
        await worker.save()
        // const update = await Worker.updateOne({email: email},{$set:{reportsAssigned: reports}} )
        res.status(200).json({worker})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

workerRouter.get("/available",async(req,res)=>{
    try {
        const worker = await Worker.find({status: "Available"});
        if(!worker)
            res.status(404).json({message: "workers not found"})
        res.status(200).json({worker})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})



export default workerRouter
