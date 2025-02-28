import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    phone: { type: String , default:""},
    location: { type: String , default:""}, // Optional user location
    points: { type: Number, default: 0 }, // Reward points
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" , default:""}], // Reports submitted
    role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

UserSchema.statics.getUsersSortedByPoints = async function () {
    return await this.find().sort({ points: -1 }); // Sort in descending order
  };

const User = mongoose.model("User", UserSchema)
export default User
