import mongoose from "mongoose";
import dotenv from 'dotenv'
 dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => console.error('Error connecting to database:', err.message)); 

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
    Feedbacks :
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
                type : String,
                required : true,
                max : 1000,
            }
            
        }
})

const Feedback = mongoose.model('Feedback',FeedbackSchema);
export default Feedback