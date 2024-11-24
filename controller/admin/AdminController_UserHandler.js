import Admin from '../../models/AdminModel.js'
import User from '../../models/UserModel.js'
import Event from '../../models/EventModel.js'
import BannedUser from '../../models/BannedUser.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import zod from 'zod'
import { use } from 'bcrypt/promises.js'
const JWT_KEY = process.env.JWT_KEY;


export const eventUserList = async(req,res) => {
    const {EventID} = req.params;
    try{
        if(!req.admin){
            return res.status(403).json({ message: "Only admins can create events" });
        }
        const usersAtEvent = await Event.findById(EventID).populate('Registered_Users')

        if(!usersAtEvent){
            return res.status(404).json({
                "message" : "Event Dosen't Exist"  
            })
        }

        const EventUserList = usersAtEvent['Registered_Users '];
        return res.status(200).json({
            "User List -:" : EventUserList
        })
    }catch(err){
        return res.status(500).json({
            "error" : err.message
        })
    }
} 

export const BanUser = async(req,res) => {
    try{
        if(!req.admin){
            return res.status(403).json({ message: "Only admins can create events" });
        }
        const {userID} = req.params
        const user = await User.findByIdAndUpdate(
            userID,
            {isBanned : true},
            {new : true}
        )
 
        if(!user){
            return res.status(404).json({
                message : "User Not Found"
            })
        }

        return res.status(200).json({"message" : "Banned User Successfully"})
    }catch(err){
        res.status(500).json({"Error while banning the User" : err.message})
    }
}

export const UnbanUser = async(req,res) => {
    try{
        if(!req.admin){
            return res.status(403).json({ message: "Only admins can create events" });
        }
        const {userID} = req.params
        const user = await User.findByIdAndUpdate(
            userID,
            {isBanned : false},
            {new : true}
        )

        if(!user){
            return res.status(404).json({
                message : "User Not Found"
            })
        }

        return res.status(200).json({"message" : "Unbanned User Successfully"})
    }catch(err){
        res.status(500).json({"Error while Unbanning the User" : err.message})
    }
}

export const DeleteUser = async(req,res) => {
    try{
        if(!req.admin){
            return res.status(403).json({ message: "Only admins can create events" });
        }
        const {userID} = req.params
        const user = await User.findByIdAndDelete(userID)

        if(!user){
            return res.status(404).json({
                message : "User Not Found"
            })
        }

        await BannedUser.create({ email : user.UserInfo.EmailID})

        return res.status(200).json({"message" : "Deleted User Successfully"})
    }catch(err){
        res.status(500).json({"Error while Deleting the User" : err.message})
    }
}