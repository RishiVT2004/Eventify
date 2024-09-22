import mongoose, { Mongoose } from "mongoose";
const DataBase_URL = process.env.URL;

mongoose.connect(DataBase_URL)
    .catch(err => {
        console.log('error while connecting to mongoDB ...',err);
    })

const UserSchema = new mongoose.Schema({
    Admin_Username : {
        type : String,
        required : true,
    },
    Password : {
        type : String,
        required : true,
    },
    AdminInfo : [{
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
            required : true
        },
        EmailID : {
            type : String,
            required : true,
            unique : true
        },
        PhoneNo : {
            type : Number,
            required : true,
            unique : true
        }
    }],

    default : []
})

const Admin = mongoose.model('Admin',UserSchema)
module.exports = {
    Admin
}