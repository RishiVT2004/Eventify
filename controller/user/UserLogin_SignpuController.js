import User from '../../models/UserModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import zod from 'zod'
const JWT_KEY = process.env.JWT_KEY

export const userSignup = async(req,res)=> {
    const {User_Username,Password,UserInfo} = req.body;
    const InputSchema = zod.object({
        User_Username : zod.string().min(6),
        Password : zod.string().min(8),
        UserInfo : zod.array(zod.object({
            Name : zod.string(),
            Age : zod.number().min(18),
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

            const HashedPassword = await bcrypt.hash(ParsedInput.data.Password , 10)
            const HashedPhoneNo = await bcrypt.hash(ParsedInput.data.UserInfo[0].PhoneNo , 10);

            const NewUser = await User.create({
                User_Username : ParsedInput.data.User_Username,
                Password : HashedPassword,
                UserInfo : [{
                    Name : ParsedInput.data.UserInfo[0].Name,
                    Age : ParsedInput.data.UserInfo[0].Age,
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
    const {User_Username,Password} = req.body;

    const InputSchema = zod.object({
        User_Username : zod.string().min(6),
        Password : zod.string().min(8)
    })

    const ParsedInput = InputSchema.safeParse(req.body);

    if(ParsedInput.success){
        try{
            const ExistingUser = await User.findOne({"User_Username" : ParsedInput.data.User_Username})
            if(!ExistingUser){
                res.status(404).json("User not registered ...");
            }

            const IsCorrectPassword = await bcrypt.compare(ParsedInput.data.Password,ExistingUser.Password);
            const IsCorrectUsername = (ParsedInput.data.User_Username === ExistingUser.User_Username);

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

            res.status(202).json({
                "message" : "User Login successful ",
                "token" : token
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

export const getUserProfile = async(req,res) => {
    res.json({
        message: "User profile fetched successfully",
        userId: req.user.id,
    });
}