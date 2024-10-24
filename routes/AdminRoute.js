import {Router} from 'express';
import dotenv from 'dotenv'
import { adminSignup,adminLogin,getAdminProfile} from '../controller/admin/AdminController_Login_Signup_Get.js';
import { eventUserList,BanUser,UnbanUser,DeleteUser } from '../controller/admin/AdminController_UserHandler.js';
import { createEvent , eventList , updateEvent , deleteEvent} from '../controller/admin/AdminController_EventHandler.js';
import { jwtAuth } from '../middlewares/Auth.js';
import rateLimiter from 'express-rate-limit'

dotenv.config();
const router = Router();

const authLimiter = rateLimiter({
    windowMs : 10*60*1000,
    max : 5,
    message : 'Too many requests from this IP, please try again later.'
})

const generalLimiter = rateLimiter({
    windowMs : 60*60*1000,
    max : 500,
    message : 'Too many requests from this IP, please try again later.'
})

// login and signup
router.post('/signup' , authLimiter ,adminSignup);
router.post('/login' , authLimiter, adminLogin );

// get admin info 
router.get('/profile',jwtAuth,getAdminProfile)

// manage users
router.get('/event/:eventID/userList',generalLimiter,jwtAuth,eventUserList) // get list of registered in a particular event 
router.put('/banUser/:userID',generalLimiter,jwtAuth,BanUser);  // ban a user 
router.put('/unbanUser/:userID',generalLimiter,jwtAuth,UnbanUser) // unban a user
router.delete('/deleteUser/:userID',generalLimiter,jwtAuth,DeleteUser) // deletes a user permanently 

// manage events 
router.get('/event',generalLimiter,jwtAuth,eventList); // get list of event 
router.post('/event',generalLimiter,jwtAuth,createEvent); // post a new event 
router.put('/updateEvent/:eventID',generalLimiter,jwtAuth,updateEvent); // update info of an event 
router.delete('/deleteEvent/:eventID',generalLimiter,jwtAuth,deleteEvent); // delete an event 

// to be implemented
//router.get('/event/:eventID/details', generalLimiter, jwtAuth, getEventDetails);
//router.get('/event/:eventID/analytics', generalLimiter, jwtAuth, getEventAnalytics);  

export default router;