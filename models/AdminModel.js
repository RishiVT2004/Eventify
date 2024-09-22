import { mongoose } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const DataBase_URL = process.env.URL;
console.log(DataBase_URL);

mongoose.connect(DataBase_URL)
    .then(() => {
        console.log('Connected to Database ...',DataBase_URL);
    })
    .catch(err => {
        console.log('error while connecting to mongoDB ...',err);
    })

const AdminSchema = new mongoose.Schema({
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
            type : String,
            required : true,
            unique : true
        }
    }],
},{default : []})

const Admin = mongoose.model('Admin',AdminSchema)
export default Admin