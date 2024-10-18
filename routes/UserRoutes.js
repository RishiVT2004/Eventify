import { Router } from "express";
import dotenv from 'dotenv';
import { jwtAuth } from "../middlewares/Auth.js";
import {userSignup,userLogin} from '../controller/user/UserLogin_SignpuController.js'
import { getUserProfile , updateUserProfile , changePassword} from "../controller/user/UserProfileHandler.js";
import { getCurrentEvent , BookEvent , deleteBooking , getUserRegisteredEvents , getEventDetails} from "../controller/user/UserEventHandler.js";
import { initiatePayment , confirmPayment , refundPayment , getPaymentStatus , listUserPayments} from "../controller/user/UserPaymentHandler.js";
dotenv.config()
const router = Router();

// signup , signin 
router.post('/signup',userSignup);
router.post('/login',userLogin);

// profile handler
router.get('/profile/',jwtAuth,getUserProfile);
router.put('/updateProfile/',jwtAuth,updateUserProfile); // update user info 
router.put('/updatePassword/',jwtAuth,changePassword); // update and change password 

// event handler 
router.get('/eventList',getCurrentEvent); // get lists of current event 
router.get('/Info/:eventID',jwtAuth , getCurrentEvent) // gets all necessary info about a particular event 
router.post('/book/:eventID',jwtAuth,BookEvent); // book ticket for an event 
router.delete('/cancel/:bookingID',jwtAuth,deleteBooking) // cancel booking for an event 
router.get('/registeredEvents',jwtAuth,getUserRegisteredEvents); // get list of event the user has bought ticket for 

// payment handler 

router.post('/payment/initiate/:bookingID' , jwtAuth , initiatePayment) // initiating payment for bookingID
router.post('/payment/confirm/:paymentID' , jwtAuth , confirmPayment) // confirm the payment 
router.post('/payment/refund/:bookingID' , jwtAuth , refundPayment) // refund the money and cancel booking
router.get('/payment/status/:paymentID' , jwtAuth , getPaymentStatus) // users to check the status of their payments
router.get('/payment/user' , jwtAuth , listUserPayments) // This route enables users to view all their payment transactions
export default router;