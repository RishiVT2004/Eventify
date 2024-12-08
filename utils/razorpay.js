
import Razorpay from 'razorpay';
import Crypto from 'crypto';

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const verifyPayment = (paymentDetails, order) => {
    // Implement Razorpay's checksum or signature verification logic
    // Example: Razorpay utility for signature verification can be used
    // Replace with actual verification logic
    try{
        const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = paymentDetails;

        const generateSignnature = crypto
        .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}--${razorpay_payment_id}`)
        .digest('hex');

        return generateSignnature === razorpay_signature
    }catch(err){
        return res.status(500).json({"Error veryfing razorpay payment signature" : err.message()});
    }   
};