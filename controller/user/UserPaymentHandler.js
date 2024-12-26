import User from "../../models/UserModel"
import Event from "../../models/EventModel"
import Payment from "../../models/PaymentModel"
import Booking from "../../models/BookingModel"
import { verifyPayment } from "../../utils/razorpay"

export const initiatePayment = async(req,res,bookingID,amount,user) => {
    try{
        const booking = await Booking.findById(bookingID);
        const option = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${bookingID}_${user.id}`,
            payment_capture: 1 // Automatically capture payment
        };
        // Create order with Razorpay
        const order = await razorpayInstance.orders.create(options);

        // Update the booking with Payment ID
        booking.PaymentID = order.id;
        booking.Status = "Pending"; // Set status to Pending until payment confirmation
        await booking.save();

        return res.status(200).json({
            message: "Payment initiated successfully.",
            order_id: order.id,
            amount: order.amount / 100, // Convert back to INR for response
            currency: order.currency,
        });

    }catch(err){
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

export const confirmPayment = async(req,res) => {

}

export const refundPayment = async(req,res) => {

}

export const getPaymentStatus = async (req, res) => {

}

export const listUserPayments = async(req,res) => {
    
}