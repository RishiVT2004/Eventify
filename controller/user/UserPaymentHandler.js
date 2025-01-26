import Razorpay from "razorpay";
import Booking from "../../models/BookingModel.js";
import Payment from "../../models/PaymentModel.js" 
import { createOrder , verifyPayment , razorpayInstance} from "../../utils/razorpay.js"
import User from "../../models/UserModel.js";

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