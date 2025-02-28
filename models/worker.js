import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    location: { type: String }, // Assigned area
    points: { type: Number, default: 0 },
    reportsAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" ,default:""}],
    status: { type: String, enum: ["Available", "In Progress"], default: "Available" },
    active: {
        type: String,
        enum: ["Online", "Offline"],
        default: "Online"
    }
}, { timestamps: true });
const Worker = mongoose.model("Worker", WorkerSchema);
export default Worker
