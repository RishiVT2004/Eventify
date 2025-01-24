import Booking from "../../models/BookingModel.js";
import Payment from "../../models/PaymentModel.js" 
import { createOrder , verifyPayment } from "../../utils/razorpay.js"

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
    const userID = req.user.id;
    try {
       


    }catch(err){
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

export const getPaymentStatus = async (req, res) => {

}

export const listUserPayments = async(req,res) => {
    
}