import User from '../../models/UserModel.js'
import BannedUser from '../../models/BannedUser.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import zod from 'zod'
import nodemailer from 'nodemailer'
const JWT_KEY = process.env.JWT_KEY

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_ID,
        pass : process.env.EMAIL_PASSWORD
    }
})

const calcAge = (dob) => {
    const birthDate = new Date(dob);
    const currAge = Date.now() - birthDate.getTime()
    const newCurrAge = new Date(currAge)
    const returnAge = Math.abs(newCurrAge.getUTCFullYear() - 1970)
    return returnAge
}

export const userSignup = async(req,res)=> {
    const {Username,Password,UserInfo} = req.body;
    const email = UserInfo[0].EmailID
    const BanUser = await BannedUser.findOne({ email });
        if (BanUser) {
            return res.status(403).json({
                message: "This email has been banned and cannot be used for signup"
            });
        }
    const InputSchema = zod.object({
        Username : zod.string().min(6),
        Password : zod.string().min(8),
        UserInfo : zod.array(zod.object({
            Name : zod.string(),
            DOB: zod.string().refine(date => !isNaN(Date.parse(date)), {
                message: "Invalid date format,date format must be year--month--day"
            }),
            Gender : zod.string(),
            EmailID : zod.string().email(),
            PhoneNo : zod.string().length(10)
        }))
    })

    const ParsedInput = InputSchema.safeParse(req.body);
    if(ParsedInput.success){
        try{
            const checkEmail = ParsedInput.data.UserInfo[0].EmailID;
            const DoesUserAlreadyExist = await User.findOne({'UserInfo.EmailID' : checkEmail});

            if(DoesUserAlreadyExist){
                res.status(400).json({
                    "message" : "User Already Exist ... please proceed to login"
                })
            }
            const Age = calcAge(ParsedInput.data.UserInfo[0].DOB)
            if(Age < 15){
                return res.status(400).json({
                    message: "You must be at least 15 years old to register as a User."
                });
            }
            const HashedPassword = await bcrypt.hash(ParsedInput.data.Password , 10)
            const HashedPhoneNo = await bcrypt.hash(ParsedInput.data.UserInfo[0].PhoneNo , 10);

            const NewUser = await User.create({
                Username : ParsedInput.data.Username,
                Password : HashedPassword,
                UserInfo : [{
                    Name : ParsedInput.data.UserInfo[0].Name,
                    DOB : ParsedInput.data.UserInfo[0].DOB,
                    Gender : ParsedInput.data.UserInfo[0].Gender,
                    EmailID : ParsedInput.data.UserInfo[0].EmailID,
                    PhoneNo : HashedPhoneNo
                }]
            })

            const token = jwt.sign({
                id : NewUser._id,
                role : "user"
            },JWT_KEY,{
                expiresIn : '1hr'
            })

            res.status(202).json({
                "message" : "User Signup successful ",
                "token" : token
            })
        }catch(err){
            res.status(403).json({
                "message " : "Error while signing up",
                "error" : err.message
            })
        }
    }else{
        res.status(403).json({
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

            const newEmailNotification = {
                from : process.env.EMAIL_ID,
                to : ExistingUser.UserInfo[0].EmailID,
                subject : 'Successful Login Notification',
                text : `Hello ${ExistingUser.UserInfo[0].Name},\n\nYou have successfully logged in to your account
                        If this is not you please change your password immidiately`
            }

            transporter.sendMail(newEmailNotification , (err,info) => {
                if(err){
                    return res.status(500).json({
                        message: 'Login successful, but failed to send email notification.',
                        error : err.message
                    });
                }else{
                    console.log('email-sent',info.response)
                    return res.status(202).json({
                        message : "User Login successful and Notification sent to registered Email",
                        token : token
                    })
                }
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

