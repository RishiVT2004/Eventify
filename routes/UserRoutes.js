import { Router } from "express";
import dotenv from 'dotenv';
import { jwtAuth } from "../middlewares/Auth.js";
import {userSignup,userLogin} from '../controller/user/UserLogin_SignpuController.js'
import { getUserProfile , updateUserProfile , changePassword} from "../controller/user/UserProfileHandler.js";
import { getCurrentEvent , BookEvent , deleteBooking , getUserRegisteredEvents , getEventDetails} from "../controller/user/UserEventHandler.js";
import { initiatePayment, refundPayment ,getPaymentStatus , listUserPayments} from "../controller/user/UserPaymentHandler.js";
import { PostReview , GetReview } from "../controller/user/UserReview.js"; 
import rateLimiter from "express-rate-limit";
import { authLimiter,generalLimiter } from "../utils/ratelimiter.js";

dotenv.config()
const router = Router();

// signup , signin 
router.post('/signup',authLimiter,userSignup);
router.post('/login',authLimiter,userLogin);

// profile handler
router.get('/profile/',generalLimiter,jwtAuth,getUserProfile);
router.put('/updateProfile/',generalLimiter,jwtAuth,updateUserProfile); // update user info 
router.put('/updatePassword/',generalLimiter,jwtAuth,changePassword); // update and change password 

// event handler 
router.get('/eventList',generalLimiter,getCurrentEvent); // get lists of current event 
router.get('/event/:eventID',generalLimiter,jwtAuth ,getEventDetails) // gets all necessary info about a particular event 
router.post('/book/:eventID',generalLimiter,jwtAuth,BookEvent); // book ticket for an event 
router.delete('/cancel/:bookingID',generalLimiter,jwtAuth,deleteBooking) // cancel booking for an event 
router.get('/registeredEvents',generalLimiter,jwtAuth,getUserRegisteredEvents); // get list of event the user has bought ticket for 

// payment handler

// initiating payment for the event 
// confirm the payment 
//refund the money and cancel booking
// above are in form of functions 
router.post('/initiatepaymet/:bookingID',authLimiter,jwtAuth,initiatePayment);
router.post('/refund/:paymentID',authLimiter,jwtAuth,refundPayment);
router.get('/payment/status/:paymentID' , generalLimiter,jwtAuth , getPaymentStatus) // users to check the status of their payments
router.get('/payment/user/:userID' , jwtAuth , generalLimiter,listUserPayments) // This route enables users to view all their payment transactions

//Event Reviews 
router.post('/event/:eventID/PostReview',generalLimiter,jwtAuth, PostReview); // Add a review for an event
router.get('/event/:eventID/GetReview', generalLimiter,GetReview); // Fetch reviews for an event

export default router;