import User from '../../models/UserModel.js'
import Event from '../../models/EventModel.js'
import Booking from '../../models/BookingModel.js'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_ID,
        pass : process.env.EMAIL_PASSWORD
    }
})

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
    const UserID = req.user.id
    try{
        const {eventID} = req.params;
        const {tickets} = req.body;

        const user = await User.findById(UserID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userEmailID = user.UserInfo[0].EmailID;
        const event = await Event.findById(eventID)
 
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if(event.Capacity < tickets){
            return res.status(403).json({message : "Not enought Tickets availiable"})
        }else if(event.Capacity == 0){
            return res.status(403).json({message : "No Tickets availiable"})            
        }
        
        const newEmailNotification = {
            from : process.env.EMAIL_ID,
            to : user.UserInfo[0].EmailID,
            subject : 'Booking successful Notification',
            text : `Hello ${user.UserInfo[0].Name} \n\n 
                    your booking for the Event -: ${event.Name} \n\n + 
                    is successful \n\n + 
                    Details of booking : \n\n + 
                    1. Event Name -> ${event.Name}\n+
                    2. Event Date -> ${event.Date}\n+
                    3. Event Location -> ${event.Location}\n+
                    4. Tickets booked -> ${tickets}
                    \n\n Please contact us for any other updates `
        }

        transporter.sendMail(newEmailNotification,(err) => {
            if(err){
                return res.status(500).json({
                    message: 'Event booked successfully, but failed to send email notification.',
                    error : err.message,
                });
            }
            event.Capacity -= tickets
            event.Registered_Users.push({
                "UserID" : req.user.id,
                "UserEmail" : userEmailID
            })
            const eventUpdate = event.save();
        
            if(!eventUpdate){
                return res.status(403).json({message  : "Booking Failed"})
            }

            return res.status(200).json({
                message: "Event booked successfully and notification sent to registered email."
            });
        })

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
        const regiseredUser = eventFromBookingIsToBeDeleted['Registered_Users'].find(user => 
            user.UserID.equals(userID)
        )
        if(!regiseredUser){
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
        
        const newEmailNotification = {
            from : process.env.EMAIL_ID,
            to : req.user.UserInfo[0].EmailID,
            subject : 'Booking cancelled Notification',
            text : `Hello ${user.UserInfo[0].Name} \n\n+
                    your booking for the Event -: ${eventFromBookingIsToBeDeleted.Name} has been succesfully cancelled \n\n + 
                    We will refund you shortly,\n\n + 
                    Please contact us for any other updates `
        }

        transporter.sendMail(newEmailNotification,(err) => {
            if(err){
                return res.status(500).json({
                    message: 'Event booked cancelled successfully, but failed to send email notification.',
                    error : err.message
                });
            }else{
                return res.status(200).json({
                    message : "Event Booked cancelled successfully and Notification sent to registered Email",
                })
            }
        })

    }catch(err){
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message 
        });
    }
}