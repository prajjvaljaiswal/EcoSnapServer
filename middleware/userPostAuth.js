import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
// import Report from "../models/report.js";
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' });


const userPostAuth = async (req, res, next) => {
    try {
        if(!req.body)
            res.status(400).json({message: "Error: filds are empty"})
        const report = await new Report(req.body)
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
        if(data.Garbage == "No" || (data.Coverage > 5 && data.Urgency == "Low") || data.Type == []){
            const update = await Report.updateOne({_id: report._id},{status:"Rejected"})
            res.status(400).json({message: "Error: It's not an garbage"})
        }
        req.report = report
        next()
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error: " + error.message });
    }
};

export default userPostAuth;

