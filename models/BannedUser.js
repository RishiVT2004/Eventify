import mongoose from "mongoose";
import dotenv from 'dotenv'
import errorMap from "zod/locales/en.js";
dotenv.config();
const URL = process.env.URL

mongoose.connect(URL)
    .catch(err => console.error('Error connecting to database:', err.message)); 
    
const BannedEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    bannedAt: {
        type: Date,
        default: Date.now
    }
});

const BannedUser = mongoose.model('BannedEmail', BannedEmailSchema);
export default BannedUser;