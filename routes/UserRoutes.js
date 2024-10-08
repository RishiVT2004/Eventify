import { Router } from "express";
import dotenv from 'dotenv';
import {userSignup,userLogin,getUserProfile} from '../controller/user/UserLogin_SignpuController.js'
import { jwtAuth } from "../middlewares/Auth.js";

dotenv.config()
const router = Router();

// signup , signin and get profile 
router.post('/signup',userSignup);
router.post('/login',userLogin);
router.get('/profile',jwtAuth,getUserProfile);
router.put('/updateProfile'); // update user info 
router.put('/updatePassword'); // update and change password 

router.get('events/eventList'); // get lists of current event 
router.post('/events/book/:eventID'); // book ticket for an event 
router.delete('/event/cancel/:bookingID') // cancel booking for an event 
router.get('/events'); // get list of event the user has bought ticket for 

export default router;