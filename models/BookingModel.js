import mongoose from "mongoose";
import dotenv from 'dotenv'
import User from "./UserModel";
import Event from "./EventModel";
dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => console.error('Error connecting to database:', err.message)); 


const BookingSchema = mongoose.Schema({
    "User" : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required :true 
    },
    "Event" : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Event',
        required : true
    },
    "Status" : {
        type : String,
        default : "Confirmed",
        enum : ["Confirmed","Cancelled","Pending","Failed","Refunded"]
    },
    "BookingDate" : {
        type : Date,
        default : Date.now,
        immutable : true
    },
    "PaymentID" : {
        type : String,
        required : true,
        unique : true
    },
    "TicketQuantity" : {
        type : Number,
        required : true,
        min : [1,'Min 1 ticket needs to be booked'],
        max : [10,'Max 10 tickets can be booked']
    },
    "AmountPaid" : {
        type : Number,
        required : true,
        validate : {
            validator : function(val){
                return val >= 99;
            },
            message: a => `${a.value} is not a valid payment amount, it must be at least 99 Rs`
        }
    }
},{default : []})

const Booking = mongoose.model('Booking',BookingSchema)

export default Booking