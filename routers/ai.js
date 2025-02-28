import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
import express from "express";
dotenv.config()

const aiRouter = express.Router() 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });

const imageResp = await fetch(
    "https://firebasestorage.googleapis.com/v0/b/threads-cfeda.appspot.com/o/images%2F1740692239545.jpg?alt=media&token=88c4647f-4128-4335-9193-9213656884ef"    

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


console.log(result.response.text());