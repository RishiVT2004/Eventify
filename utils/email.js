import Razorpay from 'razorpay';

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const verifyPayment = (paymentDetails, order) => {
    // Implement Razorpay's checksum or signature verification logic
    // Example: Razorpay utility for signature verification can be used
    return true; // Replace with actual verification logic
};