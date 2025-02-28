const { request } = require("express");
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    user: { type: String, ref: "User", required: true },
    imageUrl: { type: String, required: true }, // Cloudinary or Firebase Storage URL
    location: {
        type: String,
        required: true
    },
    description: { type: String },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    type: {
        type: String,
        require: true
    },
    assignedWorker: { type: String, ref: "Worker" },
    completionImageUrl: { type: String }, // Image after cleanup
}, { timestamps: true });
const Report = mongoose.model("Report", ReportSchema)
module.exports = Report;
