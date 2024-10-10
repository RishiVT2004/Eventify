import User from '../../models/UserModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import zod from 'zod'
import { updateEvent } from '../admin/AdminController_EventHandler.js'

const InputSchema1 = zod.object({
    Username : zod.string().min(6),
    EmailID : zod.string().email(),
    PhoneNo : zod.string().length(10)
})

const InputSchema2 = zod.object({
    Password : zod.string().min(8)
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

        updates = {} // tracks the updated fields , user is not required to provide all 3 fileds at once 
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
    try{
        const NewPassword = InputSchema2.safeParse(req.body)
        if(!NewPassword.success){
            return res.status(400).json({
                message: "Invalid input credentials",
                errors: NewPassword.error.errors 
            })
        }
        const NewHashedPassword = await bcrypt.hash(NewPassword.data.Password,10)
        const PasswordToUpdate = await User.findByIdAndUpdate(
            req.user.id,
            {"Password" : NewHashedPassword},
            {new : true}
        )
        if(!PasswordToUpdate){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Password updated successfully" });

    }catch(err){
        res.status(500).json({ 
                message: "Error updating profile",
                error: err.message 
            });
    }
}