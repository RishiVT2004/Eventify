import mongoose from "mongoose";
import dotenv from 'dotenv'

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