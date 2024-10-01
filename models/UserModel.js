import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const URL = process.env.URL;

mongoose.connect(URL)
    .catch(err => console.error('Error connecting to database:', err.message)); 


const UserSchema = new mongoose.Schema({
    User_Username : {
        type : String,
        required : true,
    },
    Password : {
        type : String,
        required : true,
    },
    UserInfo : [{
        Name : {
            type : String,
            required : true
        },
        Age : {
            type : Number,
            required : true
        },
        Gender : {
            type : String,
            required : true,
            enum : ['Male','Female','Others']
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