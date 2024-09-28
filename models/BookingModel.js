import mongoose from "mongoose";
import dotenv from 'dotenv'
import User from "./UserModel";
import Event from "./EventModel";
dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => {
        console.log(err);
});

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
    "AmountPaid" : {
        type : Double,
        required : true,
        validate : {
            validator : function(val){
                return val >= 99;
            },
            message : a => `${a.val} is not a valid payement amount , it must be min 99 rs`
        }
    },
    "TicketQuantity" : {
        type : Number,
        required : true,
        min : [1,'Min 1 ticket needs to be booked'],
        max : [10,'Max 10 tickets can be booked']
    }
},{default : []})

const Booking = mongoose.model('Booking',BookingSchema)

export default Booking