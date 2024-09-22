const Admin = require('../models/AdminModel');
const jwt = require('jsonwebtoken');
import {bcrypt} from bcryptjs
const zod = require('zod')

export const adminSignup = async(req,res) => {

try{
    const {Admin_Username,Password,AdminInfo} = req.body;

    // Input Validation 

    const InputSchema = zod.object({
        Admin_Username : zod.string().min(8),
        Password : zod.string().min(8),
        AdminInfo : [{
            Name : zod.string(),
            Age : zod.number(),
            Gender : zod.string().length(1),
            EmailID : zod.string().email(),
            PhoneNo : zod.number().length(10)
        }]
    })

    const ParsedInput = InputSchema.safeParse({
        Admin_Username,
        Password,
        AdminInfo : [{
            Name,Age,Gender,EmailID,Password
        }]
    })

     // checking if admin exists
    const CheckEmail = ParsedInput.data.AdminInfo[0].EmailID; 
    const DoesAdminAlreadyExist = await Admin.findOne({CheckEmail});
    if(DoesAdminAlreadyExist){;
         return res.status(400).json({error : "User is already Registered"});
    }

    // hashing
    if(ParsedInput.success){
        const HashedPassword = await bcrypt.hash(ParsedInput.data.Password);
        const HashedPhoneNo = await bcrypt.hash(ParsedInput.data.AdminInfo[0].PhoneNo);
        
        await Admin.create({
            Admin_Username : ParsedInput.data.Admin_Username,
            Password : HashedPassword,
            ...AdminInfo,
            Name : ParsedInput.data.AdminInfo[0].Name,
            Age : ParsedInput.data.AdminInfo[0].Age,
            Gender : ParsedInput.data.AdminInfo[0].Gender,
            EmailID : ParsedInput.data.AdminInfo[0].EmailID,
            PhoneNo : HashedPhoneNo
        })

    }else{
        res.status(503).json({message : "Error in parsing"})
    }


    }catch(err){
        res.status(403).json({
            message : 'invalid input credentials',
            error : err
        })
    }
}
