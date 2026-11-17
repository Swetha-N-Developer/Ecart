const express = require('express');// by only using express js we can create a route in nodejs
const { processPayment, sendStripeApi } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/authenticate');
const router = express.Router();//here we create a router object express router function


router.route('/payment/process').post(isAuthenticatedUser, processPayment);
router.route('/stripeapi').get(isAuthenticatedUser, sendStripeApi);

module.exports = router; //to use the router in all files we export router object