import User from '../../models/UserModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import zod from 'zod'

const InputSchema = zod.object({
    Username : zod.string().min(6),
    EmailID : zod.string().email(),
    PhoneNo : zod.string().length(10)
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

export const UpdateUserProfile = async(req,res) => {
    if(!req.user){
        return res.status(403).json({message : "Only User can change respective info"})
    }

    const ParsedInput = InputSchema.safeParse({

    })
} 