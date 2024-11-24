import User from '../../models/UserModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import zod from 'zod'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_ID,
        pass : process.env.EMAIL_PASSWORD
    }
})


const InputSchema1 = zod.object({
    Username : zod.string().min(6),
    EmailID : zod.string().email(),
    PhoneNo : zod.string().length(10)
})

const InputSchema2 = zod.object({
    EmailID : zod.string().email(),
    New_Password : zod.string().min(8)
})

export const getUserProfile = async(req,res) => {
    const userID = req.user.id
    const userProfile = await User.findOne({_id : userID})

    if(!userProfile){
       return res.status(404).json({
           message : "User Not Found"
       })
    }
   
   res.status(200).json({
       message: "User profile fetched successfully",
       userInfo : userProfile
   });
}

export const updateUserProfile = async(req,res) => {
    if(!req.user){
        return res.status(403).json({message : "Only User can change respective info"})
    }
    try{
        const ParsedInput = InputSchema1.safeParse(req.body)
        if(!ParsedInput.success){
            return res.status(400).json({
                message: "Invalid input credentials",
                errors: ParsedInput.error.errors 
            })
        }

        let updates = {} // tracks the updated fields , user is not required to provide all 3 fileds at once 
        if(ParsedInput.data.Username){
            updates.Username = ParsedInput.data.Username
        }
        if(ParsedInput.data.EmailID){
            updates.EmailID = ParsedInput.data.EmailID
        }
        if(ParsedInput.data.Username){
            updates.PhoneNo = await bcrypt.hash(ParsedInput.data.PhoneNo, 10)
        }

        const UserToUpdate = await User.findByIdAndUpdate(
            req.user.id , 
            updates, 
            {new : true}
        )

        if(!UserToUpdate){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: UserToUpdate });
    }catch(err){
        res.status(500).json({ 
                message: "Error updating profile",
                error: err.message 
            });
    }
} 

export const changePassword = async(req,res) => {
    if(!req.user){
        return res.status(403).json({message : "Only User can change respective info"})
    }
    const ParsedInput = InputSchema2.safeParse(req.body)
    if (!ParsedInput.success) {
        return res.status(400).json({
            message: 'Invalid input',
            errors: ParsedInput.error.errors,
        });
    }
    try{
        const user = await User.findOne({ 'UserInfo.EmailID': ParsedInput.data.EmailID });
        const HashedPassword = await bcrypt.hash(ParsedInput.data.New_Password,10)

        user.Password = HashedPassword;
        await user.save();

        const newEmailNotification = {
            from : process.env.EMAIL_ID,
            to : user.UserInfo.EmailID,
            subject : 'Password Reset Successful',
            text : `Hello ${user.UserInfo[0].Name},\n\nYou have successfully changed your password` 
        }
        transporter.sendMail(newEmailNotification , (err)=> {
            if(err){
                return res.status(500).json({
                    message: 'Password changed successfully, but failed to send email notification.',
                    error : err.message,
                    token : token
                });
            }else{
                return res.status(200).json({
                    message : "User Password changed and Notification sent to registered Email",
                    token : token
                })
            }
        })

    }catch(err){
        res.status(500).json({ 
                message: "Error updating profile",
                error: err.message 
            });
    }
}