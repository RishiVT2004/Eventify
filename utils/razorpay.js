import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import Crypto from 'crypto';
dotenv.config();

export const razorpayInstance = () => {
    if(!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Missing Razorpay key ID or secret in environment variables."); 
    }
    
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
}
// razorpay server responds with a unique id 
export const createOrder = async(options) => {
    try{
        order = await razorpayInstance.orders.create(options);
        return order;
    }catch(err){
        return res.status(500).json({
            message:'Error creating Razorpay order', 
            error: err.message 
        });
    }
}
export const verifyPayment = async(paymentDetails) => {
    // Implement Razorpay's checksum or signature verification logic
    // Example: Razorpay utility for signature verification can be used
    // Replace with actual verification logic
    try{
        const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = paymentDetails;

        const generateSignnature = Crypto
        .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}--${razorpay_payment_id}`)
        .digest('hex');

        return generateSignnature === razorpay_signature // return boolean
    }catch(err){
        return res.status(500).json({"Error veryfing razorpay payment signature" : err.message()});
    }   
};

export const refund_Payment = async(razorpay_payment_id,options) => {
    const refund = await Razorpay.refunds.create(razorpay_payment_id,options);
    return refund.status;
}