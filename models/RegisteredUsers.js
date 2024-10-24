import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv'
import { Schema, string } from "zod";
dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => console.error('Error connecting to database:', err.message)); 


const RegisteredUserSchema = new mongoose.Schema({
    EventID : {
        type : mongoose.Schema.Types.ObjectID,
        ref : 'Event',
        required : true
    },
    Event_Name : {
        type : 'String',
        require : true
    },
    UserList : [
    {
        UserID : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        UserName : {
          type : String,
          required : true
        },
        EmailID : {
            type : String,
            required : true
        },
        BookingID : {
            type : String,
            ref : 'Booking'
        },
        PaymentID : {
            type : String,
            ref : 'Payment'
        }     
    }
]
},{default : {}})

const RegisteredUser = mongoose.model('RegisteredUsers',RegisteredUserSchema);
export default RegisteredUser