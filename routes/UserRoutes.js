import { Router } from "express";
import dotenv from 'dotenv';
import { jwtAuth } from "../middlewares/Auth.js";
import {userSignup,userLogin} from '../controller/user/UserLogin_SignpuController.js'
import { getUserProfile , updateUserProfile , changePassword} from "../controller/user/UserProfileHandler.js";
import { getCurrentEvent , BookEvent , deleteBooking , getUserRegisteredEvents , getEventDetails} from "../controller/user/UserEventHandler.js";
import { initiatePayment , confirmPayment , refundPayment , getPaymentStatus , listUserPayments} from "../controller/user/UserPaymentHandler.js";
import { PostReview , GetReview } from "../controller/user/userReview.js"; 
import rateLimiter from "express-rate-limit";

dotenv.config()
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

// signup , signin 
router.post('/signup',authLimiter,userSignup);
router.post('/login',authLimiter,userLogin);

// profile handler
router.get('/profile/',generalLimiter,jwtAuth,getUserProfile);
router.put('/updateProfile/',generalLimiter,jwtAuth,updateUserProfile); // update user info 
router.put('/updatePassword/',generalLimiter,changePassword); // update and change password 

// event handler 
router.get('/eventList',generalLimiter,getCurrentEvent); // get lists of current event 
router.get('/event/:eventID',generalLimiter,jwtAuth ,getEventDetails) // gets all necessary info about a particular event 
router.post('/book/:eventID',generalLimiter,jwtAuth,BookEvent); // book ticket for an event 
router.delete('/cancel/:bookingID',generalLimiter,jwtAuth,deleteBooking) // cancel booking for an event 
router.get('/registeredEvents',generalLimiter,jwtAuth,getUserRegisteredEvents); // get list of event the user has bought ticket for 

// payment handler (to be implemented)

router.post('/payment/initiate/:bookingID' ,generalLimiter, jwtAuth , initiatePayment) // initiating payment for bookingID
router.post('/payment/confirm/:paymentID' ,generalLimiter, jwtAuth , confirmPayment) // confirm the payment 
router.post('/payment/refund/:bookingID' , generalLimiter,jwtAuth , refundPayment) // refund the money and cancel booking
router.get('/payment/status/:paymentID' , generalLimiter,jwtAuth , getPaymentStatus) // users to check the status of their payments
router.get('/payment/user' , jwtAuth , generalLimiter,listUserPayments) // This route enables users to view all their payment transactions

//Event Reviews (to be implemented)
//router.post('/event/:eventID/PostReview', jwtAuth, addEventReview); // Add a review for an event
//router.get('/event/:eventID/GetReview', getEventReviews); // Fetch reviews for an event

export default router;