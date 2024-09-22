import Admin from '../models/AdminModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import zod from 'zod'

export const adminSignup = async(req,res) => {

try{
    const {Admin_Username,Password,AdminInfo} = req.body;

    // Input Validation 

    const InputSchema = zod.object({
        Admin_Username : zod.string().min(8),
        Password : zod.string().min(8),
        AdminInfo : zod.array(zod.object({
            Name : zod.string(),
            Age : zod.number().min(18),
            Gender : zod.string(),
            EmailID : zod.string().email(),
            PhoneNo : zod.string().length(10)
        }))
        
    })

    const ParsedInput = InputSchema.safeParse(req.body)

    if(!ParsedInput.success){
        console.log(ParsedInput.error); // Log the error for debugging
            return res.status(400).json({
                message: "Error in parsing",
                errors: ParsedInput.error.errors // Return detailed errors
            });
    }

     // checking if admin exists
    const CheckEmail = ParsedInput.data.AdminInfo[0].EmailID; 
    const DoesAdminAlreadyExist = await Admin.findOne({'AdminInfo.EmailID' : CheckEmail});
    if(DoesAdminAlreadyExist){;
         return res.status(400).json({error : "User is already Registered"});
    }

    // hashing
    const HashedPassword = await bcrypt.hash(ParsedInput.data.Password,10);
    const HashedPhoneNo = await bcrypt.hash(ParsedInput.data.AdminInfo[0].PhoneNo,10);
        
    await Admin.create({
        Admin_Username : ParsedInput.data.Admin_Username,
        Password : HashedPassword,
        AdminInfo : [{
            Name : ParsedInput.data.AdminInfo[0].Name,
            Age : ParsedInput.data.AdminInfo[0].Age,
            Gender : ParsedInput.data.AdminInfo[0].Gender,
            EmailID : ParsedInput.data.AdminInfo[0].EmailID,
            PhoneNo : HashedPhoneNo
        }]
    })
        
    res.status(201).json({ message: "Admin registered successfully!" });


    }catch(err){
        res.status(403).json({
            message : 'invalid input credentials',
            error : err.message
        })
    }
}
