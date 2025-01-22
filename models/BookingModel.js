import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => console.error('Error connecting to database:', err.message)); 


const BookingSchema = new mongoose.Schema({
    UserID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required :true 
    },
    EventID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Event',
        required : true
    },
    Status : {
        type : String,
        default : "", // null untill paymengt is processed
        enum : ["Confirmed","Cancelled","Pending","Failed","Refunded"]
    },
    BookingDate : {
        type : Date,
        default : Date.now,
        immutable : true
    },
    PaymentID : {
        type : String,
        required : false, // not required at time of booking 
        unique : true
    },
    Tickets : {
        type : Number,
        required : true,
        min : [1,'Min 1 ticket needs to be booked'],
        max : [10,'Max 10 tickets can be booked']
    },
    Amount : {
        type : Number,
        required : true,
        validate : {
            validator : function(val){
                return val >= 0;
            },
            message: a => `${a.value} is not a valid payment amount, it must be at least 99 Rs`
        }
    }
},{timestamps : true})

const Booking = mongoose.model('Booking',BookingSchema)
export default Booking