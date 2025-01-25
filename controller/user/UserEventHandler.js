import dotenv from 'dotenv'
dotenv.config();
import User from '../../models/UserModel.js'
import Event from '../../models/EventModel.js'
import Booking from '../../models/BookingModel.js'
import { sendEmailNotification } from '../../utils/email.js';
import { initiatePayment , confirmPayment ,refundPayment} from './UserPaymentHandler.js';
import { createOrder,verifyPayment } from '../../utils/razorpay.js';
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

        // Call initiatePayment to process the payment
        const paymentResponse = await initiatePayment(req,res,newBooking._id, amount, user);

        // Check if payment was successful
        if (paymentResponse.success) {
            // check paymemt confirmation 
            const isPaymentConfirmed = await confirmPayment(req,res,{
                razorpay_payment_id : paymentResponse.razorpay_payment_id,
                payment_order_id : paymentResponse.payment_order_id,
                razorpay_signature : paymentResponse.razorpay_signature
            });

            if(isPaymentConfirmed.success){
                 // Send confirmation email if payment is successful here
                const emailReceiver = user.UserInfo.EmailID; // Assuming EmailID is a string property
                const emailSubject = `Booking Confirmation for Event ${event.Name}`;
                const emailText = `Dear ${user.Username},\n\nThank you for booking ${tickets} ticket(s) for ${event.Name}.
                \nYour booking ID is ${newBooking._id}.\nTotal Amount: ₹${amount / 100}\n\nBest Regards,\nTeam Eventify`;
                
                await sendEmailNotification(emailReceiver, emailSubject, emailText);
    
                return res.status(201).json({
                    success: true,
                    order_id: paymentResponse.order_id,
                    amount: amount / 100,
                    currency: paymentResponse.currency,
                    message: "Booking created successfully and payment processed."
                });
            }else{
                return res.status(400).json({ message: "Payment confirmation failed." });
            }
        } else {
            return res.status(400).json({ message: "Payment processing failed." });
        }

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
        
        const EventID = await Booking.EventID;
        const Event = Event.findById(EventID);

        // refund user
        const refundResponse = await refundPayment(ValidBooking);

        // delete booking record 
        if(refundResponse.success){
            Event.Tickets += ValidBooking.Tickets;
            const deleteBookingRecord = await Booking.findByIdAndDelete(ValidBooking);
            if(deleteBookingRecord.success){
                // send the user confirmatory email 
                const emailReceiver = User.UserInfo.EmailID;
                const emailSubject = `Booking Deleted for Event ${EventName} and Payment Refunded`;
                const emailText = `Dear ${req.user.Username},\n\nYour booking for the event ${EventName} bearing the booking number 
                ${bookingID} is successfully deleted and your payment for the booking will also be refunded shortly\n\n
                For any other concerns please feel confortable to contact us\n\nBest Regards,\nTeam Eventify;`

                await SendmailTransport(emailReceiver,emailSubject,emailText);
                return res.status(200).json({
                    success : true,
                    message : `Booking Deleted ... Payment Refunded and Email Sent to ${req.user.EmailID}`
                })
            }else{
                return res.status(400).json({ message: "Booking Deletion failed." });
            }
        }else{
            return res.status(400).json({ message: "Payment Refunding failed." });
        }
        
    }catch(err){
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message 
        });
    }
}