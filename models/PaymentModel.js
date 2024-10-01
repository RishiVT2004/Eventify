import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => console.error('Error connecting to database:', err.message)); 

const PaymentSchema = new mongoose.Schema({
    "UserID" : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User',
        required : true,
    },
    "EventID" : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Event',
        required : true
    },
    "PaymentID" : {
        type : String,
        required : true,
        unique : true
    },
    "PaymentTime" :{
        type : Date,
        default : Date.now,
        immutable : true
    },
    "Tickets" : {
        type : Number,
        required : true,
        min : 1,
        max : 10
    },
    "AmountPaid" : {
        type : Number,
        required : true,
        min : [99 , 'Min amount to be paid is 99']
    },
    "PaymentMethod" : {
        type : String,
        required : true,
        enum : ['Net-Banking','UPI','Debit-Card']
    },
    "PaymentStatus" : {
        type : String,
        required : true,
        enum : ['Pending','Success','Failed'],
        default : 'Pending' 
    }
})

const Payment = mongoose.model('Payment',PaymentSchema)

export default Payment