const User = require('../models/userModel');//User modelname in userModel
const catchAsyncError = require('../middlewares/catchAsyncError');//tohandle promise errors
const jwt = require('jsonwebtoken');//jsonwebtoken package
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');

exports.isAuthenticatedUser = catchAsyncError(async(req, res, next) =>{
    const {token} = req.cookies;//req.cookies-to access the data in cookie.from that we get the token

    if(!token)//if token is not available
    {
        return next(new ErrorHandler('Login first to handle this resource',401));
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    //jwt.verify()-this function is used to check whether the token is valid if the token does not matches the secret key or the expire time exceeds
    //decoded - contains the token value if it is valid

    req.user = await User.findById(decoded.id);//now req.user contains all user data except password based on id in token

    next();//call controller

})

exports.authorizeRoles = (...roles) =>{
    //...roles - get the argument from route.this is higher order function that returns another function
    return (req, res, next)=>{
        if(!roles.includes(req.user.role))//includes - array function that checks whether it is in req.user
        {
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed`,401));
        }  
        next();
      }
} 


