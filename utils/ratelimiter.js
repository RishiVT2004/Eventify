import rateLimiter from "express-rate-limit";

const authLimiter = rateLimiter({
    windowMs : 10*60*1000, //  This field defines the time window (in milliseconds) during which the rate limit will be enforced.
    max : 5, // This field specifies the maximum number of requests allowed within the defined
    message : 'Too many requests from this IP, please try again later.' // custom error message 
})

const generalLimiter = rateLimiter({
    windowMs : 60*60*1000, //  This field defines the time window (in milliseconds) during which the rate limit will be enforced.
    max : 5, // This field specifies the maximum number of requests allowed within the defined
    message : 'Too many requests from this IP, please try again later.' // custom error message 
})

export {authLimiter,generalLimiter}