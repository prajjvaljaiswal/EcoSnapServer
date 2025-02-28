import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Report from "../models/report";
// import Report from "../models/report";
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });
const workerPostAuth = async (req, res, next) => {
    try {
        const id = req.query.id;
        const report = await Report.findById(id);

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
        const update = await Report.updateOne({_id: id},req.body )
        next();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error: " + error.message });
    }
};

export default workerPostAuth;
