import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    photoUrl: { type: String},
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    createdBy: { type: String, ref: "Admin", required: true },
    participants: [{ type: String, ref: "User" }],
    maxParticipants: { type: Number, required: true },
    status: { type: String, enum: ["Upcoming", "Ongoing", "Completed"], default: "Upcoming" },
    rewardPoints: { type: Number, default: 10 },
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;
