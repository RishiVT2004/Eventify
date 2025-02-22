import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => console.error('Error connecting to database:', err.message)); 

const PaymentSchema = new mongoose.Schema({
    UserID : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User',
        required : true,
    },
    EventID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Event',
        required : true
    },BookingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    PaymentID : {
        type : String,
        required : true,
        unique : true
    },
    Tickets : {
        type : Number,
        required : true,
        min : [1,'Min tickets to book is 1'],
        max : [10,'Max tickets to book is 10']
    },
    AmountPaid : {
        type : Number,
        required : true,
    },
    PaymentMethod : {
        type : String,
        required : true,
        enum : ['Net-Banking','UPI','Debit-Card'],
        default : ""
    },
    PaymentStatus : {
        type : String,
        required : true,
        enum : ['Pending','Success','Failed','Refunded'],
        default : 'Pending' 
    },
    razorpay_payment_id: { 
        type: String 
    },
    razorpay_order_id: { 
        type: String 
    },
    razorpay_signature: { 
        type: String 
    }
},{timestamps : true}) // automatically creates a createdat and updatedat fields 

const Payment = mongoose.model('Payment',PaymentSchema)

export default Payment