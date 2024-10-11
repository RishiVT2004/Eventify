import { Router } from "express";
import dotenv from 'dotenv';
import {userSignup,userLogin} from '../controller/user/UserLogin_SignpuController.js'
import { getUserProfile , updateUserProfile , changePassword} from "../controller/user/UserProfileHandler.js";
import { jwtAuth } from "../middlewares/Auth.js";
import { getCurrentEvent , BookEvent , deleteBooking , getUserRegisteredEvents } from "../controller/user/UserEventHandler.js";

dotenv.config()
const router = Router();

// signup , signin 
router.post('/signup',userSignup);
router.post('/login',userLogin);

router.get('/profile/',jwtAuth,getUserProfile);
router.put('/updateProfile/',jwtAuth,updateUserProfile); // update user info 
router.put('/updatePassword/',jwtAuth,changePassword); // update and change password 

router.get('event/eventList',getCurrentEvent); // get lists of current event 
router.post('/event/book/:eventID',jwtAuth,BookEvent); // book ticket for an event 
router.delete('/event/cancel/:bookingID',jwtAuth,deleteBooking) // cancel booking for an event 
router.get('/event/registeredEvents',jwtAuth,getUserRegisteredEvents); // get list of event the user has bought ticket for 


export default router;