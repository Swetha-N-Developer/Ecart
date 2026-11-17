const catchAsyncError = require('../middlewares/catchAsyncError')
//catchAsyncError - to handle async errors.If Stripe returns an error, catchAsyncError catches it and passes it to your error-handling middleware.

const stripe= require('stripe')(process.env.STRIPE_SECRET_KEY)
/*
    import stripe package with secretKey.
    usually environment can acess within the request handler
    we cant access in import package area so we have to change the location of environment variable configuration from server.js to app.js
    sk_test = Secret key. Backend only.
    pk_test = Publishable key. Can be shared with frontend.
*/  




//Creates a payment using Stripe and sends the client secret to React.
exports.processPayment = catchAsyncError(async(req,res,next)=>{

    /*
        exports.processPayment – Exports this function so you can use it in your routes.
        catchAsyncError – Handles asynchronous errors.
        async – Allows you to use await.
        req – Receives data from the frontend.
        res – Sends a response to the frontend.
        next – Passes errors or control to the next middleware.
        */

    //create payment process.paymentIntent - async function.create -method
    const paymentIntent = await stripe.paymentIntents.create({
        //options we should give to create payment
        amount: req.body.amount,
        currency: "usd",
        description: "TEST PAYMENT",//need od payment
        metadata: { integration_check: "accept_payment" },//hidden detail
        shipping: req.body.shipping //shipping details in frontend
    })

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
        //client secret key for each payment.it gets from paymentintent object
    })

})

exports.sendStripeApi = catchAsyncError(async (req, res, next) => {

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
        //its a publish key we should send it to frontend for payment integration 

    })

})















