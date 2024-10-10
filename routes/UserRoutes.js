import { Router } from "express";
import dotenv from 'dotenv';
import {userSignup,userLogin} from '../controller/user/UserLogin_SignpuController.js'
import { getUserProfile , updateUserProfile , changePassword} from "../controller/user/UserProfileHandler.js";
import { jwtAuth } from "../middlewares/Auth.js";

dotenv.config()
const router = Router();

// signup , signin and get profile 
router.post('/signup',userSignup);
router.post('/login',userLogin);
router.get('/profile/',jwtAuth,getUserProfile);

router.put('/updateProfile/',jwtAuth,updateUserProfile); // update user info 
router.put('/updatePassword/',jwtAuth,changePassword); // update and change password 

router.get('events/eventList'); // get lists of current event 
router.post('/events/book/:eventID'); // book ticket for an event 
router.delete('/event/cancel/:bookingID') // cancel booking for an event 
router.get('/:userID/events'); // get list of event the user has bought ticket for 


export default router;