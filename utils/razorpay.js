import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import Crypto from 'crypto';
dotenv.config();

export const razorpayInstance = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
});

// razorpay server responds with a unique id 
export const createOrder = async(options) => {
    try{
        const order = await razorpayInstance.orders.create(options);
        return order; // razorpay order id / payment id  
    }catch(err){
        throw new Error("Error creating Razorpay order: " + err.message); // no usage of res in function 
    }
}

export const refund_Payment = async(razorpay_payment_id,options) => {
    try{
    const refund = await Razorpay.payments.refund(razorpay_payment_id,options);
    return refund.status;
    }
    catch(err){
        throw new Error("Error processing refund: " + err.message);
    }
}

/*
razorpay_order_id -> (Generated when order is created)	Used to identify a payment attempt (linked to multiple payments if retries happen)
razorpay_payment_id	-> (Generated after payment is completed)	Unique identifier for a successful transaction
razorpay_signature ->  Used for verification
*/