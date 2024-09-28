import mongoose from "mongoose";
import dotenv from 'dotenv'
import User from "./UserModel";
dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err=>{
        console.log(err);
    });

const EventSchema = new mongoose.Schema({
    "Name" : {
        type : String,
        required : true,
    },
    "Date" : {
        type : String,
        required : true,
    },
    "Location" : {
        type : String,
        required : true
    },
    "Capacity" : {
        type : Number,
        required : true,
        min : 30
    },
    "Price" : {
        type : Double,
        required : true,
        min : 99
    },
    "Created_At" : {
        type : Date,
        default : Date.now,
        immutable: true
    },
    "Updated_At" : {
        type : Date,
        default : Date.now
    },
    "Registered_Users : " : [
        {
            "userID" : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User',
                required : true,
                immutable: true
            }
        },{
            "paymentID" : {
                type: String, 
                required: true,
                unique : true,
                immutable: true
            }
        },{
            "bookingDate" : {
                type: Date,
                default: Date.now,
                immutable: true
            },
        }
    ]
},{default : []})

EventSchema.pre('save' , function(next){
    this.Updated_At = Date.now();
    next();
})

const Event = mongoose.model('Event',EventSchema)
export default Event
