import express from "express"
import Report from "../models/report.js"
import User from "../models/user.js";
import Worker from "../models/worker.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()
// import userPostAuth from "../middleware/userPostAuth.js"
// import workerPostAuth from "../middleware/workerPostAuth.js"

const reportRouter = express.Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });


const userPostAuth = async (req, res, next) => {
    try {
        if(!req.body)
            res.status(400).json({message: "Error: filds are empty"})
        let report = await new Report(req.body)
        await report.save()
        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ message: "Error: enter all fields" });
        }

        // Fetch image and convert to buffer
        const imageResp = await fetch(imageUrl).then(response => response.arrayBuffer());

        // Convert to base64 string
        const base64Image = Buffer.from(imageResp).toString("base64");

        // Generate AI response
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg",
                },
            },
            "Analyze this image for garbage and return a compact JSON response in this exact format: {Garbage: Yes/No, Types: [Plastic, Organic, Metal, Glass, Electronic, Hazardous], Coverage: XX(% in number), Urgency: Low/Medium/High}. Avoid additional explanations."
        ]);

        const responseText = await result.response.text()
        const preData = responseText.replace(/```json/g, '') 
        .replace(/```/g, '')       
        .trim();
        console.log(JSON.parse(preData));
        const data = JSON.parse(preData)
        if(data.Garbage == "No" || (parseInt(data.Coverage) < 20 && data.Urgency == "Low") || data.Type == []){
             report.status = "Rejected"
             report.description = "Garbage not valid"
             await report.save()
            // res.status(400).json({message: "Error: It's not an garbage"})
        }
        req.report = report
        next()
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error: " + error.message });
    }
};

const workerPostAuth = async (req, res, next) => {
    try {
        const id = req.query.id;
        const report = await Report.findById(id);
        req.report = report

        if (!report) {
            return res.status(404).json({ message: "Error: Report not found" });
        }

        req.report = report;
        const preImageUrl = report.imageUrl;  // Previous image (before cleanup)
        const { imageUrl } = req.body;        // New image (after cleanup)

        if (!imageUrl) {
            return res.status(400).json({ message: "Error: Enter all fields" });
        }

        // 🔹 Function to fetch & convert an image to Base64
        const fetchBase64Image = async (url) => {
            const imageResp = await fetch(url);
            const buffer = await imageResp.arrayBuffer();
            return Buffer.from(buffer).toString("base64");
        };

        // 🔹 Convert both images to Base64
        const preImageBase64 = await fetchBase64Image(preImageUrl);
        const newImageBase64 = await fetchBase64Image(imageUrl);

        // 🔹 Generate AI response by comparing both images at once
        const result = await model.generateContent([
            {
                inlineData: {
                    data: preImageBase64,
                    mimeType: "image/jpeg",
                },
            },
            {
                inlineData: {
                    data: newImageBase64,
                    mimeType: "image/jpeg",
                },
            },
            `Compare these two images. The first image is BEFORE cleanup, and the second is AFTER cleanup. 
            Return a JSON in this exact format:
            {Cleaned: true/false, RemainingGarbage: [Types], CoverageReduction: XX(% in number), Notes: "Short summary"}
            Avoid additional explanations.`
        ]);

        // 🔹 Parse the AI response
        const responseText = await result.response.text();
        const cleanedData = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(cleanedData);

        console.log("Comparison Analysis:", analysis);

        // 🔹 Store results in request object for further processing
        req.analysis = analysis;
        next();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error: " + error.message });
    }
};




reportRouter.post("/create", userPostAuth,async(req,res)=>{
    try {
        const report = req.report
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
        const update = await Report.updateOne({_id: id},{$set: req.body} )
        res.status(200).json({update})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

reportRouter.put("/worker/update", workerPostAuth,async(req,res)=>{
    try {
        const id = req.query.id
        const report = req.report
        const analysis = req.analysis
        if(!report)
            res.status(404).json({message: "Error: report not found"})
        if(analysis.Cleaned && (analysis.CoverageReduction > 90)){
            report.status = "Completed"
            report.description = analysis.Notes
            await report.save()
            const user = await User.findOne({email: report.user})
            user.points = user.points+10
            await user.save()
            const worker = await findOne({email: report.assignedWorker})
            worker.points = worker.points + 1
            await worker.save()
        }
        // const update = await Report.updateOne({_id: id},req.body )
        res.status(200).json({report, analysis})
    } catch (error) {
        res.status(400).json({message: "Error: "+error})
    }
})

reportRouter.put("/assign",async(req,res)=>{
    try {
        const id = new mongoose.Types.ObjectId(req.query.id)
        const report = await Report.findById(id)
        if(!report)
            res.status(404).json({message: "Error: report not found"})
        const update = await Report.updateOne({_id: report._id},{$set:{reportsAssigned: req.body.reportsAssigned}} )
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

