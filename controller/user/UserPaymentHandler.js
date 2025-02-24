import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../../models/BookingModel.js";
import Payment from "../../models/PaymentModel.js" 
import { createOrder  , refund_Payment} from "../../utils/razorpay.js"
import User from "../../models/UserModel.js";
import exp from "constants";
import { stat } from "fs";
/*
export const initiatePayment = async(req,res,bookingID,amount,user) => { // where we will call this from 
    try{
        const booking = await Booking.findById(bookingID);

        const payment = new Payment({
            UserID : user._id,
            EventID : booking.EventID,
            BookingID : booking._id,
            Tickets : booking.Tickets,
            AmountPaid : amount,
        })

        // Creating instance of new Razorpay order 

        const option = {
            amount : amount*100, // amount tracked in paise 
            currency : "INR",
            reciept : `reciept_${bookingID}_${user._id}`,
            payment_capture : 1
        }

        // create new order for razorpay instance 
        const neworder = await createOrder(option);
        
        // Update payment model 
        payment.PaymentID = neworder.id;
        await payment.save();

        // Update booking model 
        booking.PaymentID = neworder.id;
        booking.Status = "Pending";
        await booking.save();

        return res.status(200).json({
            message : "Payment initiated successfully",
            order_id: neworder.id, 
            amount: neworder.amount/100, // generates in rs 
            currency: neworder.currency,
        });


    }catch(err){
        return res.status(500).json({ 
            message: "Internal Server Error", error: err.message
        });
    }
}

export const confirmPayment = async (req, res, paymentData) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentData;
  
        // Verify payment signature
        const isValidPayment = await verifyPayment({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        });
  
        if(!isValidPayment) {
            return res.status(400).json({ message: "Payment Verification Failed" });
        }
  
        // Find the corresponding booking
        const booking = await Booking.findOne({ PaymentID: razorpay_order_id });
        if(!booking){
            return res.status(404).json({ message: "Booking not found." });
        }
  
        // Check if booking is already confirmed
        if(booking.Status === 'Confirmed'){
            return res.status(200).json({ message: "Booking is already confirmed" });
        }
  
        // Update booking status
        booking.Status = "Confirmed";
        await booking.save();
  
        // Update Payment model (if it exists)
        const payment = await Payment.findOne({ BookingID: booking._id });
        payment.Status = "Confirmed";
        await payment.save();
  
        return res.status(200).json({ message: "Payment confirmed successfully." });
    } catch (err) {
      console.error("Error confirming payment:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const refundPayment = async(req,res,bookingID) => {
    if (!req.user) {
        return res.status(403).json({ message: "Only User can book tickets for an event" });
    }
    const {userID} = req.user.id;
    // payment id -> razorpay order id 
    try {
        // Validate Booking ID
        const booking = await Booking.findOne({ BookingID: bookingID });
        if(!booking){
            return res.status(404).json({ message: "Booking not found." });
        }

        // Retrieve Payment details
        const paymentID = booking.PaymentID;
        const payment = await Payment.findOne({ PaymentID: paymentID });
        if(!payment){
            return res.status(404).json({ message: "No valid payment record found." });
        }

        const amount = payment.AmountPaid;
        const razorpay_payment_id = payment.PaymentID;
        const refund_option = {
            amount : amount*100, // converting to paise
            speed : regular
        }

        const razorpay = razorpayInstance();
        const refund = razorpay.refunds.create(razorpay_payment_id,refund_option);
        if(refund.status === 'processed'){
            payment.status == 'Refunded'
            return {
                success : true
            }
        }else{
            return res.status(500).json({error : "Error while processing razorpay refunding"});
        }
        
    }catch(err){
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}
*/

export const initiatePayment = async(req,res) => {
    if(!req.user){
        return res.status(403).json({message : "Only User can book tickets for an event"})
    }
    try{
        const {bookingid} = req.params;
        const booking = await Booking.findById(bookingid);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if(booking.Status != 'Pending'){
            return res.status(400).json({ message: "Payment already initiated or completed for this booking" });       
        }

        const option = { // object for razorpay instance 
            amount : booking.Amount*100,
            currency : "INR",
            receipt: `receipt_${bookingid}_${booking.UserID}`,
            payment_capture: 1            
        }

        const newOrder = await createOrder(option);
        if (!newOrder || !newOrder.id) {
            return res.status(500).json({ message: "Failed to create Razorpay order" });
        }

        const payment = new Payment({ // new payment object
            UserID : booking.UserID,
            EventID : booking.EventID,
            BookingID : bookingid,
            PaymentID: newOrder.id, // razorpay_order_id
            Tickets : booking.Tickets,
            AmountPaid : booking.Amount
        })


        await payment.save();

        booking.PaymentID = newOrder.id;
        booking.Status = "Pending";

        await booking.save();

        return res.status(200).json({
            message : "Payment initiated successfully",
            razorpay_order_id: newOrder.id, 
            amount: newOrder.amount/100, // generates in rs 
        });
    }catch(err){
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}


export const razorpayWebhook = async(req,res) => {
    try{
        const razorpay_signature = req.headers['x-razorpay-signature'];
        const secretkey = process.env.RAZORPAY_KEY_SECRET // key for verifying signature

        const body = JSON.stringify(req.body); // convert body(razorpayy data) to JSON string 
        const expectedsignature = crypto.createHmac('sha256',secretkey).update(body).digest('hex'); // signature verification in webhooks or API authentication.
        /*
            crypto.createHmac('sha256', secretkey)
            Creates an HMAC object using the SHA-256 hashing algorithm.
            secretkey is the private key used for hashing (typically provided by a payment gateway or API for security verification).
            
            .update(body)
            Feeds the body (which could be a request payload or message) into the HMAC function.
            This ensures that the hash is computed based on the actual data.
            
            .digest('hex')
            Converts the final hash into a hexadecimal string format.
        */

        // If the signature does not match, reject the request
        if(expectedsignature !== razorpay_signature){
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const {payload} = req.body;
        const event = payload.payment.entity; // represent razorpay object 
        const paymentID = event.id; // Razorpay Payment ID
        const orderID = event.order_id; // Order ID linked to this payment
        const status = event.status; // Payment status (e.g., "captured", "failed")

        // find payment record in database and Update payment status in the database 
        const payment = await Payment.findOne({PaymentID : orderID});
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        if(status === 'captured'){
            payment.Status = 'Success';
        }else{
            payment.Status = 'Failed';
        }   

        // Update the associated booking status based on payment success/failure
        payment.razorpay_payment_id = paymentID;
        await payment.save();

        if(status === 'captured'){
            await Booking.findOneAndUpdate(payment.BookingID , {Status : 'Confirmed'});
        }else{
            await Booking.findByIdAndUpdate(payment.BookingID, { Status: 'Failed' });
        }

    }catch(err){
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
} 

export const refundPayment = async(req,res) => {
    if(!req.user){
        return res.status(403).json({message : "Only User can book tickets for an event"})
    }
    try{
        const userID = req.user.id;
        const {paymentID} = req.params; // deconstruct paymentID from object 

        const payment = await Payment.findOne({UserID : userID,razorpay_payment_id : paymentID});
        if(!payment){
            return res.status(404).json({ message: 'Payment record not found' });
        }
        
        const paymentStatus = payment.Status;
        if(paymentStatus === 'Refunded'){
            return res.status(400).json({ message: 'Payment has already been refunded' });
        }
        
        const options = {
            amount : payment.AmountPaid, // Refund the full amount
            speed : "normal", // Faster refund processing when possible
            reciept : `**refunded** Time : ${Date.now()} PaymentID : ${paymentID} userID : ${userID} amount : ${payment.AmountPaid}`,
        }

        const refund = await refund_Payment(paymentID,options);

        payment.Status = 'Refunded';
        await payment.save();

        const booking = await Booking.findByIdAndUpdate(payment.BookingID,{Status : "Refunded"});
        await booking.save();

        const refundDetails = {
            refundID : refund.id,
            refundStatus : refund.status
        }

        return res.status(200).json({
            message: 'Refund processed successfully',
            Info : refundDetails
        });

    }catch(err){
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
}

export const getPaymentStatus = async (req, res) => {
    
    const {paymentID} = req.params;
    if(!paymentID){
        return res.status(400).json({error : "No valid Payment ID provided in params"});
    }
    if(!req.user){
        return res.status(403).json({ message: "Only User check for its payment status" })
    }
    try{
        const payment = Payment.findOne({PaymentID : paymentID});
        if(!payment){
            return res.status(400).json({error : "No payment record available with give payment ID"});
        }
        const userID = payment.UserID;
        if(userID !== req.user.id){
            return res.status(400).json({ message: "Invalid User..." });
        }

        const paymemtStatus = payment.Status;
        
        return res.status(200).json({
            "paymentID" : paymentID,
            "status" : paymemtStatus
        })

    }catch(err){
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

export const listUserPayments = async(req,res) => {
    const {userID} = req.params;
    if(!req.user || req.user !== userID){
        return res.status(403).json({ message: "Only User check for its payment status" })
    }
    try{
        const payment = await Payment.find({UserID : userID});

        const paymemtinfo = payment.map(payment => ({
            EventID : payment.EventID,
            PaymentID : payment.PaymentID,
            Amount : payment.AmountPaid,
            Tickets : payment.Tickets,
            Status : payment.Status
        }))

        return res.status(200).json({
            message : "Details of Previous Payments",
            record : paymemtinfo
        })

    }catch(err){
        return res.status(500).json({ message: "Internal Server Error", error: err.message });       
    }
}