import Admin from '../../models/AdminModel.js'
import User from '../../models/UserModel.js'
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