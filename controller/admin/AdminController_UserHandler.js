import Admin from '../../models/AdminModel.js'
import User from '../../models/UserModel.js'
import Event from '../../models/EventModel.js'
import BannedUser from '../../models/BannedUser.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import zod from 'zod'
import { use } from 'bcrypt/promises.js'
const JWT_KEY = process.env.JWT_KEY;

export const userList = async(req,res) => {
    try{
        const user = await User.find();
        
        const userList = user.map(user => ({
            "UserID" : user._id,
            "Username" : user.User_Username,
            "Name" : user.UserInfo[0].Name,
            "EmailID" : user.UserInfo[0].EmailID
        }))
        
        res.status(200).json({
            "message" : "Registed User List",
            "List" : userList
        })

    }catch(err){
        res.status(403).json({
           "error" : err.message
        })
    }
}

export const eventUserList = async(req,res) => {
    const {EventID} = req.params;
    try{
        const usersAtEvent = await Event.findById(EventID).populate('Registered_Users')

        if(!usersAtEvent){
            res.status(404).json({
                "message" : "Event Dosen't Exist"  
            })
        }

        const EventUserList = usersAtEvent['Registered_Users '];
        return res.status(200).json({
            "User List -:" : EventUserList
        })
    }catch(err){
        res.status(500).json({
            "error" : err.message
        })
    }
} 

export const BanUser = async(req,res) => {
    try{
        const {userID} = req.params
        const user = await User.findByIdAndUpdate(
            userID,
            {isBanned : true},
            {new : true}
        )

        if(!user){
            res.status(404).json({
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
        const {userID} = req.params
        const user = await User.findByIdAndUpdate(
            userID,
            {isBanned : false},
            {new : true}
        )

        if(!user){
            res.status(404).json({
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
        const {userID} = req.params
        const user = User.findByIdAndDelete(userID)

        if(!user){
            res.status(404).json({
                message : "User Not Found"
            })
        }

        await BannedUser.create({ email : user.UserInfo[0].EmailID})

        return res.status(200).json({"message" : "Deleted User Successfully"})
    }catch(err){
        res.status(500).json({"Error while Deleting the User" : err.message})
    }
}