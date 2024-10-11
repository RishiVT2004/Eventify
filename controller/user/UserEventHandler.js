import User from '../../models/UserModel.js'
import Event from '../../models/EventModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import zod from 'zod'

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

export const BookEvent = async(req,res) => {
    
    if(!req.user){
        return res.status(403).json({message : "Only User can book tickets for an event"})
    }
    try{
        const {eventID} = req.params
        const eventToBook = await Event.findById(eventID)
        if(!eventToBook){
            return res.status(404).json({message  : "The respective Event does not exist"})
        }

        if(eventToBook.Capacity == 0){
            return res.status(400).json({ message: "Event is fully booked" });
        }
        eventToBook.Capacity -= 1;
        eventToBook['Registered_Users '].push({
            "UserID" : req.user.id,
            "User-Email" : "",
            "PaymentID" : ""
        })

        const booking = await eventToBook.save()

        if(!booking){
            return res.status(403).json({message  : "Booking Failed"})
        }
        return res.status(200).json({message : `Booking Confirmed for user ${req.user.id}`})
    }
    catch(err){
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message 
        });
    }
}

export const getUserRegisteredEvents = async(req,res) => {
    const {UserID} = req.user.id;
    if(!req.user){
        return res.status(403).json({message : "Only User can book tickets for an event"})
    }
    try{
        const registeredEvent = await Event.find({UserID})
        console.log(UserID,registeredEvent)
        if(!registeredEvent || registeredEvent.length === 0){
            return res.status(404).json({message  : "User has not registered in any event"})
        }
        
        const eventList = registeredEvent.map(Event => {
            return {
                "eventID" : Event._id,
                "EventName" : Event.Name,
                "EventDate" : Event.Date
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
    const {eventID} = req.params
    if(!req.user){
        return res.status(403).json({message : "Only User can book tickets for an event"})
    }
    try{
        const eventFromBookingIsToBeDeleted = await Event.findOne({_id : eventID})
        if(!eventFromBookingIsToBeDeleted){
            return res.status(404).json({ message: "Event not found" });
        }
        const regiseredUser = eventFromBookingIsToBeDeleted['Registered_Users'].find(user => user.UserID.equals(req.user._id))
        if(!regiseredUser){
            return res.status(404).json({ message: "User is not registered to this event" });
        }

        await Event.findByIdAndUpdate(
            eventID,
            {$pull : {Registered_User : {UserID : req.user._id}}},
            {new : true}
        )

        return res.status(200).json({ message: "Booking successfully deleted" });

    }catch(err){
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message 
        });
    }
}