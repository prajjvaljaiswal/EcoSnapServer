import express from "express";
import { 
    createEvent, getAllEvents, getEventById, updateEvent, deleteEvent,
    joinEvent, leaveEvent, getUserEvents, getAvailableEvents 
} from "../controllers/eventControler.js";


const eventRouter = express.Router();

// Admin Routes
eventRouter.post("/create", createEvent);
eventRouter.put("/update", updateEvent);
eventRouter.delete("/delete", deleteEvent);

// Public/User Routes
eventRouter.get("/all", getAllEvents);
eventRouter.get("/available", getAvailableEvents);
eventRouter.get("/one", getEventById);

// User Participation
eventRouter.post("/join", joinEvent);
eventRouter.post("/leave", leaveEvent);
eventRouter.get("/user", getUserEvents);

export default eventRouter;
