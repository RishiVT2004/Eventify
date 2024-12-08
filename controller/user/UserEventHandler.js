import dotenv from 'dotenv'
dotenv.config();
import User from '../../models/UserModel.js'
import Event from '../../models/EventModel.js'
import Booking from '../../models/BookingModel.js'
import { sendEmailNotification } from '../../utils/email.js';
import { razorpayInstance } from '../../utils/razorpay.js';


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

export const BookEvent = async(req,res) => {
    if(!req.user){
        return res.status(403).json({message : "Only User can book tickets for an event"})
    }
    const userID = req.user.id
    try{
        const {eventID} = req.params;
        const {tickets} = req.body;

        if (!tickets || tickets <= 0) {
            return res.status(400).json({ message: "Invalid ticket quantity." });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const event = await Event.findById(eventID)
 
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if(event.Tickets_Availiable < tickets){
            return res.status(403).json({message : "Not enought Tickets availiable"})
        }else if(event.Tickets_Availiable == 0){
            return res.status(403).json({message : "No Tickets availiable"})            
        }

        const amount = tickets*event.Price
        const option = {
            amount : amount,
            currency : "INR",
            receipt : `receipt_${eventID}_${userID}`,
            payement_capture : 1 
        }

        const order = await razorpayInstance.orders.create(option)

        // implement processing payement part in payement route 
        

        const newBooking = await Booking.create({
            UserID : userID,
            EventID : eventID,
            Tickets : tickets,
            Amount : amount/100,
            PaymentID : order.id
        })


        event.Tickets_Availiable -= tickets;
        event.save();
        newBooking.save();

        // send confirmation email here

        return res.status(201).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
        });

        // to be updated how to save the info in database after payment route is complete

    }catch(err){
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message 
        })
    }
}
       

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
    const {bookingID} = req.params
    const userID = req.user.id
    try{
        const booking = await Booking.findById(bookingID);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const eventID = booking.EmailID
        const eventFromBookingIsToBeDeleted = await Event.findById(eventID)

        if(!eventFromBookingIsToBeDeleted){
            return res.status(404).json({ message: "Event not found" });
        }
        const registeredUser = eventFromBookingIsToBeDeleted['Registered_Users'].find(user => 
            user.UserID.equals(userID)
        )
        if(!registeredUser){
            return res.status(404).json({ message: "User is not registered to this event" });
        }

        const ticketBooked = booking.TicketQuantity;

        await Event.findByIdAndUpdate(
            eventID,
            {
                $pull : {Registered_User : {UserID : userID}},
                $inc : {Capacity : ticketBooked}
            },
            {new : true}
        )

        await Booking.findByIdAndDelete(bookingID);

        // implement refunding part in payment section 
        
        // send confirmation email here 

    }catch(err){
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message 
        });
    }
}