import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => console.error('Error connecting to database:', err.message)); 


const UserSchema = new mongoose.Schema({
    Username : {
        type : String,
        required : true,
    },
    Password : {
        type : String,
        required : true,
    },
    isBanned : {
        type : Boolean,
        default : false
    },
    UserInfo : [{
        Name : {
            type : String,
            required : true,
            immutable : true
        },
        DOB: {
            type: Date, 
            required: true
        },
        Gender : {
            type : String,
            required : true,
            enum : ['Male','Female','Others'],
            immutable : true
        },
        EmailID : {
            type : String,
            required : true,
            unique : true
        },
        PhoneNo : {
            type : String,
            required : true,
            unique : true
        }
    }],

}, {default  : []});

const User = mongoose.model('User',UserSchema);
export default User;