import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => console.error('Error connecting to database:', err.message)); 


const EventSchema = new mongoose.Schema({
    Name : {
        type : String,
        required : true,
    },
    Date : {
        type : String,
        required : true,
    },
    Location : {
        type : String,
        required : true
    },
    Capacity : {
        type : Number,
        required : true,
        min : [20,'Capacity for event needs to be min 20']
    },
    Tickets_Availiable : {
        type : Number,
        min : 0
    },
    Price : {
        type : Number,
        required : true,
        min : [99,'Price for each ticket must be min 99 Rupees']
    },
    Created_At : {
        type : Date,
        default : Date.now,
        immutable: true
    },
    Updated_At : {
        type : Date,
        default : Date.now
    }
})
const Event = mongoose.model('Event',EventSchema)
export default Event
