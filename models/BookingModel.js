import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => {
        console.log(err);
});

const BookingSchema = mongoose.Schema({
    
})