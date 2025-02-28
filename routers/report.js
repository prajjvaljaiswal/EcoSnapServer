import express from "express"
import Report from "../models/report.js"

const reportRouter = express.Router()

reportRouter.post("/create",async(req,res)=>{
    try {
        if(!req.body)
            res.status(400).json({message: "Error: filds are empty"})
        const report = await new Report(req.body)
        await report.save()
        res.status(200).json({report})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

reportRouter.get("/all",async(req,res)=>{
    try {
        const reports = await Report.find()
        if(!reports)
            res.status(404).json({message: "Error: report not found"})
        res.status(200).json({reports})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

reportRouter.get("/from",async(req,res)=>{
    try {
        const {id, userId, workerId} = req.query
        let report;
        if(id)
            {report = await Report.findById(id)}
        else if(userId)
            {report = await Report.find({user: userId})}
        else if(userId)
            {report = await Report.find({assignedWorker: workerId})}
        if(!report)
            res.status(404).json({message: " report not found"})
        res.status(200).json({report})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

reportRouter.put("/update",async(req,res)=>{
    try {
        const id = req.query.id
        const report = await Report.findById(id)
        if(!report)
            res.status(404).json({message: "Error: report not found"})
        const update = await Report.updateOne({_id: id},req.body )
        await update.save()
        res.status(200).json({update})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

reportRouter.put("/assign",async(req,res)=>{
    try {
        const {id} = req.query
        const report = await Report.findById(id)
        if(!report)
            res.status(404).json({message: "Error: report not found"})
        const update = await Report.updateOne({_id: id},req.body )
        await update.save()
        res.status(200).json({update})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

reportRouter.delete("/delete",async(req,res)=>{
    try {
        const {id} = req.query
        const report = await Report.findById(id)
        if(!report)
            res.status(404).json({message: "Error: report not found"})
        await Report.deleteOne({_id:id})
        res.status(200).json({message: "delete sucessfull"})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

export default reportRouter

