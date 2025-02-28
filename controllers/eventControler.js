import Event from "../models/event.js";

// 🎯 Create Event (Admin Only)
export const createEvent = async (req, res) => {
    try {
        // const { title, description, location, date, time, maxParticipants, rewardPoints } = req.body;
        if(!req.body)
            res.status(500).json({ message: "Enter data" });
        const newEvent = new Event(req.body);

        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error });
    }
};

// 🎯 Get All Events
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }
};

// 🎯 Get Single Event
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.query.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event", error });
    }
};

// 🎯 Update Event (Admin Only)
export const updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.query.id, req.body, { new: true });
        if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
        res.status(200).json({ message: "Event updated", event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error });
    }
};

// 🎯 Delete Event (Admin Only)
export const deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.query.id);
        if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error });
    }
};

// 🎯 Join Event (User)
export const joinEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.query.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.participants.includes(req.body.email))
            return res.status(400).json({ message: "You have already joined this event" });

        if (event.participants.length >= event.maxParticipants)
            return res.status(400).json({ message: "Event is full" });

        event.participants.push(req.body.email);
        await event.save();

        res.status(200).json({ message: "Successfully joined event", event });
    } catch (error) {
        res.status(500).json({ message: "Error joining event", error });
    }
};

// 🎯 Leave Event (User)
export const leaveEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.query.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        event.participants = event.participants.filter(participant => participant !== req.body.email);
        await event.save();

        res.status(200).json({ message: "Successfully left event", event });
    } catch (error) {
        res.status(500).json({ message: "Error leaving event", error });
    }
};

// 🎯 Get User's Joined Events
export const getUserEvents = async (req, res) => {
    try {
        const events = await Event.find({ participants: req.query.email });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user events", error });
    }
};

// 🎯 Get Available Events
export const getAvailableEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: "Upcoming" });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching available events", error });
    }
};
