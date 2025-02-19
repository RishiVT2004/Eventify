import dotenv from 'dotenv'
dotenv.config();
import User from '../../models/UserModel.js'
import Event from '../../models/EventModel.js'
import Booking from '../../models/BookingModel.js'
import { sendEmailNotification } from '../../utils/email.js';
import SendmailTransport from 'nodemailer/lib/sendmail-transport/index.js';


export const getCurrentEvent = async(req,res) => {
    try{
        const currentEvents = await Event.find()
        if(!currentEvents){
            return res.status(403).json({message  : "No upcoming Events availiable"})
        }
        return res.status(200).json({
            message : "List of Upcoming Events",
            currentEvents
        })
    }catch(err){
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message 
        });
    }
}

export const getEventDetails = async(req,res) => {
    
    const {eventID} = req.params
    try{
        const event = await Event.findById(eventID);

        if(!event){
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({ message: "Event details", event });
    }
    catch(err){
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message 
        })
    }
}

export const BookEvent = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ message: "Only User can book tickets for an event" });
    }
    
    const userID = req.user.id;
    try {
        const { eventID } = req.params;
        const { tickets } = req.body;

        if (!tickets || tickets <= 0) {
            return res.status(400).json({ message: "Invalid ticket quantity." });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const event = await Event.findById(eventID);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.Tickets_Availiable < tickets) {
            return res.status(403).json({ message: "Not enough Tickets available" });
        } else if (event.Tickets_Availiable === 0) {
            return res.status(403).json({ message: "No Tickets available" });
        }

        // Create a new booking record
        const amount = tickets * event.Price; // Amount in paise
        const newBooking = await Booking.create({
            UserID: userID,
            EventID: eventID,
            Tickets: tickets,
            Amount: amount / 100, // Store amount in INR
            PaymentID: 'null', // Initially set to pending until payment is processed
            Status : "Pending"
        });

        // Update available tickets for the event
        event.Tickets_Availiable -= tickets;
        await event.save();
        
        await sendEmailNotification(
            user.UserInfo.EmailID,
            "Booking Confirmation",
            `Hello ${user.UserInfo.Name},\n\nYour booking bearing the id ${newBooking._id} has been confirmed. Thank you!\n\nRegards,\nTeam Eventify`
        )

    } catch (err) {
        return res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};
       

export const getUserRegisteredEvents = async(req,res) => {
    if(!req.user){
        return res.status(403).json({message : "Only User can book tickets for an event"})
    }

    const {userID} = req.user.id;

    try{
        const registeredEvent = await Event.find(Event.Registered_Users.UserID == userID)
        if(!registeredEvent || registeredEvent.length === 0){
            return res.status(404).json({message  : "User has not registered in any event"})
        }
        
        const eventList = registeredEvent.map(event => { // reference to Event 
            return {
                UserID : event.Registered_Users,
                eventID : event._id,
                EventName : event.Name,
                EventDate : event.Date
            }
        })
        
       
        return res.status(200).json({
            message : "List of event User has registered in are : ",
            eventList
        })

    }catch(err){
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message 
        });
    }
}

export const deleteBooking = async(req,res) => {
    if(!req.user){
        return res.status(403).json({message : "Only User can book tickets for an event"})
    }
    const userID = req.user.id;
    try{
        const {bookingID} = req.params; 
        if(!bookingID){
            return res.status(404).json({message: "BookingID not found" }); // check if booking id is present in params 
        }

        const ValidBooking = await Booking.findById(bookingID);
        if(!ValidBooking){
            return res.status(404).json({ message: "Invalid Booking ID" }); // check for valid booking id 
        }

        if(ValidBooking.UserID != userID){
            return res.status(401).json({ message: "Unauthorized action. You can only delete your own bookings." });
        }
        
        const user = await User.findById(ValidBooking.UserID);
        const EventID = ValidBooking.EventID;
        const event = await Event.findById(EventID);
        event.Tickets_Availiable += ValidBooking.Tickets;
        await event.save();

        ValidBooking.Status = 'Cancelled';
        await ValidBooking.save();
        try{
            await sendEmailNotification(
                user.UserInfo.EmailID,
                "Delete Booking Confirmation",
                `Hello ${user.UserInfo.Name},\n\nYour booking bearing the id ${ValidBooking._id} has been cancelled. Thank you!\n\nRegards,\nTeam Eventify`
            )
        }catch(err){
            res.status(401).json({"Error sending email" : err.message})
        }
       
        
    }catch(err){
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message 
        });
    }
}