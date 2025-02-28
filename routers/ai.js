import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
import express from "express";
dotenv.config()

const aiRouter = express.Router() 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

const imageResp = await fetch(
    imageUrl    
)
    .then((response) => response.arrayBuffer());

const result = await model.generateContent([
    {
        inlineData: {
            data: Buffer.from(imageResp).toString("base64"),
            mimeType: "image/jpeg",
        },
    },
    "Analyze this image for garbage and return a compact JSON response in this exact format: {Garbage: Yes/No, Types: [Plastic, Organic, Metal, Glass, Electronic, Hazardous], Coverage: XX%, Urgency: Low/Medium/High}. Avoid additional explanations."    
]);

aiRouter.post("/user",async(req,res)=>{
    try {
        const {imageUrl} = req.body
        const data = await result.response.text();
    } catch (error) {
        
    }
})



// console.log(result.response.text());