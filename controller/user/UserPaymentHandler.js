import Booking from "../../models/BookingModel.js";
import Payment from "../../models/PaymentModel.js" 
import { verifyPayment } from "../../utils/razorpay.js"

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
            amount : amount*100,
            currency : "INR",
            reciept : `reciept_${bookingID}_${user._id}`,
            payment_capture : 1
        }

        // create and verify the order 
        


    }catch(err){
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

export const confirmPayment = async(req,res) => {
    try{
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingID } = req.body;

        const isPaymentVerified = verifyPayment({razorpay_payment_id,razorpay_order_id,razorpay_signature});
        if(!isPaymentVerified){
            return res.status(400).json({ message: "Payment verification failed." });
        }

        // find booking id in database and update status 

        bookingID.PaymentID = razorpay_payment_id;
        bookingID.Status = "Confirmed"; // Payment Successful
        await Booking.save();
        return res.status(200).json({ message: "Payment confirmed successfully." });

    }catch(err){
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

export const refundPayment = async(req,res) => {
    try {
        const {bookingID} = req.params;
        
        const booking = await Booking.findById(bookingID);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.Status !== "Confirmed") {
            return res.status(400).json({ message: "Only confirmed bookings can be refunded" });
        }
    }catch(err){
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

export const getPaymentStatus = async (req, res) => {

}

export const listUserPayments = async(req,res) => {
    
}