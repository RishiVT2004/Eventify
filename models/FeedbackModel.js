import mongoose from "mongoose";
import dotenv from 'dotenv'
import { string } from "zod";
dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => {
        console.error('Error connecting to database:', err.message); 
    });

const FeedbackSchema = new mongoose.Schema({
    EventID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Event',
        required : true
    },
    Event_Name : {
        type : String,
        required : true
    },
    Feedbacks : [
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
            Ratings : {
                type : Number,
                required : true,
                min : 1,
                max : 5
            },
            Message : {
                type : string,
                required : true,
                max : 1000,
            }
            
        }
    ]
})

const Feedbacks = mongoose.model('Feedback',FeedbackSchema);
export default Feedbacks