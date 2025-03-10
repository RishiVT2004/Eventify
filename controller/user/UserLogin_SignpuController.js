import User from '../../models/UserModel.js'
import BannedUser from '../../models/BannedUser.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import zod from 'zod'
import { sendEmailNotification } from '../../utils/email.js'
const JWT_KEY = process.env.JWT_KEY

const calcAge = (dob) => {
    const birthDate = new Date(dob);
    const currAge = Date.now() - birthDate.getTime();
    const newCurrAge = new Date(currAge);
    const returnAge = Math.abs(newCurrAge.getUTCFullYear() - 1970);
    return returnAge;
};

export const userSignup = async(req,res)=> {
    const {Username,Password,UserInfo} = req.body;
    
    const email = UserInfo.EmailID
    const BanUser = await BannedUser.findOne({ email });
        if (BanUser) {
            return res.status(403).json({
                message: "This email has been banned and cannot be used for signup"
            });
        }
    const InputSchema = zod.object({
        Username : zod.string().min(6),
        Password : zod.string().min(8),
        UserInfo : zod.object({
            Name : zod.string(),
            DOB: zod.string().refine((date) => {
                const [day, month, year] = date.split('/');
                const isoDate = `${year}-${month}-${day}`;
                return !isNaN(Date.parse(isoDate)); // Ensure it's a valid date
            }, {
                message: "Invalid date format, expected format is DD/MM/YYYY",
            }),
            Gender : zod.string(),
            EmailID : zod.string().email(),
            PhoneNo : zod.string().length(10)
        })
    })

    const ParsedInput = InputSchema.safeParse(req.body);
    
    if(ParsedInput.success){
        try{
            const {DOB} = UserInfo;
            const checkEmail = ParsedInput.data.UserInfo.EmailID;
            const DoesUserAlreadyExist = await User.findOne({'UserInfo.EmailID' : checkEmail});

            if(DoesUserAlreadyExist){
                return res.status(400).json({
                    "message" : "User Already Exist ... please proceed to login"
                })
            }

            // Convert DOB to ISO format for compatibility
            const [day, month, year] = DOB.split('/');
            const isoDOB = `${year}-${month}-${day}`;

            const Age = calcAge(isoDOB);
            if(Age < 15){
                return res.status(400).json({
                    message: "You must be at least 15 years old to register as a User."
                });
            }
            const HashedPassword = await bcrypt.hash(ParsedInput.data.Password , 10)
            const HashedPhoneNo = await bcrypt.hash(ParsedInput.data.UserInfo.PhoneNo , 10);


            const NewUser = await User.create({
                Username : ParsedInput.data.Username,
                Password : HashedPassword,
                UserInfo : {
                    Name : ParsedInput.data.UserInfo.Name,
                    DOB : isoDOB,
                    Gender : ParsedInput.data.UserInfo.Gender,
                    EmailID : ParsedInput.data.UserInfo.EmailID,
                    PhoneNo : HashedPhoneNo
                }
            })

            const token = jwt.sign({
                id : NewUser._id,
                role : "user"
            },JWT_KEY,{
                expiresIn : '1hr'
            })
            try{
                await sendEmailNotification(
                    NewUser.UserInfo.EmailID,
                    "Welcome to Eventify",
                    `Hello ${NewUser.UserInfo.Name},\n\nYour user account has been successfully created. Welcome aboard!\n\nRegards,\nTeam Eventify`
                )
            }catch(err){
                return res.status(500).json({"error" : "failed to send email","message" : err.message});
            }
            return res.status(202).json({
                "message" : "User Signup successful ",
                "token" : token
            })
        }catch(err){
            return res.status(403).json({
                "message " : "Error while signing up",
                "error" : err.message
            })
        }
    }else{
        return res.status(403).json({
            message : 'invalid input credentials',
        })
    }
}


export const userLogin = async(req,res) => {
    const {Username,Password} = req.body;

    const InputSchema = zod.object({
        Username : zod.string().min(6),
        Password : zod.string().min(8)
    })

    const ParsedInput = InputSchema.safeParse(req.body);

    if(ParsedInput.success){
        try{
            const ExistingUser = await User.findOne({"Username" : ParsedInput.data.Username})
            if(!ExistingUser){
                res.status(404).json("User not registered ...");
            }

            const IsCorrectPassword = await bcrypt.compare(ParsedInput.data.Password,ExistingUser.Password);
            const IsCorrectUsername = (ParsedInput.data.Username === ExistingUser.Username);

            if(!IsCorrectPassword || !IsCorrectUsername){
                res.status(403).json({
                    message : "Invalid Username or Password",
                })
            }

            const token = jwt.sign({
                id : ExistingUser._id,
                role : "user"
            },JWT_KEY,{
                expiresIn : '1hr'
            })

            try{
                await sendEmailNotification(
                    ExistingUser.UserInfo.EmailID,
                    "Welcome to Eventify",
                    `Hello ${ExistingUser.UserInfo.Name},\n\nYou have logged in to eventify. Welcome aboard!.\n\nPS : If this is not you immediately contact us \n\n.Regards,\nTeam Eventify`
                )
            }catch(err){
                return res.status(500).json({"error" : "failed to send email","message" : err.message});
            }

            return res.status(202).json({
                message : "User Login successful",
                token : token
            })
             
        }catch(err){
            res.status(404).json({"error" : err.message})
        }
    }else{
        res.status(403).json({
            message : "invalid input credentials .. please try again",
            error : ParsedInput.error.errors
        })
    }
}

