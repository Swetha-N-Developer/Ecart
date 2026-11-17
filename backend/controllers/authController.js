const User = require('../models/userModel');//User modelname in userModel
const catchAsyncError = require('../middlewares/catchAsyncError');//tohandle promise errors
const jwt = require('jsonwebtoken');//jsonwebtoken package
const sendToken = require('../utils/jwt.js');//utils function for generating toke and its response
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/email.js');
const crypto = require('crypto');

//Register - api/v1/register -post
exports.registerUser = catchAsyncError(async (req, res, next) =>{

    const {name,email,password} = req.body;
    //object destructing - get name ,email ,password, avatar from rquest body and store it  in respective variables
    //we cant get avatar from request body because avatar is optional

    let avatar;//initially undefined
    if(req.file)
    {
        avatar = `${req.protocol}://${req.host}/uploads/user/${req.file.originalname}`
    /*
    here we set url for avatar
    req.protocol - http
    req.host - localhost:3030
    req.file.originalname - original name of file that we seleted
    */
    }
    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    /*
    //token generation
    const token = user.getJwtToken();
    //token is a variable that contains generated token.user(variable contains the created data it calls the getJwtToken function in model )

    //success response
    res.status(201).json({
        success : true,
        user,
        token//to display token
    })
        */
       sendToken(user,201,res);
})

//login User-{{base_url}}/api/v1/login - post
exports.loginUser = catchAsyncError(async(req, res, next)=>{
    const {email,password} = req.body;

    if(!email || !password)
    {
        return next(new ErrorHandler('please enter email and password'));
        //show error message if email or password is empty
    }

    const user = await User.findOne({email}).select('+password');
    //get single userdata based on email. that userdata must include password
    
    if(!user)//if user data is not available then email is not matched
    {
        return next(new ErrorHandler('email or password is not valid'));
        //then here we show an error msg.actually here email is not valid but we are not supposed to show that msg becoz the hackker will easily identify that password is not matched
    }

    //check whether the password is correct
    if(!await user.isValidPassword(password))//isValidPassword is a function declared in User model.js
    {
        return next(new ErrorHandler('Invalid email or password'));
    }

    sendToken(user,200,res);//generate token and set the token in cookie
})

//logout -  {{base_url}}/api/v1/logout -get

exports.logoutUser = (req, res, next) =>{
    res.cookie('token',null,{//it deletes the token in cookie from users browser
        expires : new Date(Date.now()),//ends the expires time immediately
        httpOnly : true//prevent XSS attacks
    }).status(200)
        .json({
            success : true,
            message : "loggedOut"
        })
    
}

//forget password- {{base_url}}/api/v1/password/forgot -post
//  we generate token for rreset password and email  an reset link to the user
exports.forgetPassword = catchAsyncError(async(req, res, next)=>{
    const user = await User.findOne({email : req.body.email});
    //User.findOne - getthe single document from db,{email:req.body.email}-based on email it fetches document
    //user is a variable that contains document object based on email

    if(!user)//if email is not found
    {
        return next(new ErrorHandler('user not found with this email'));
    }

    const resetToken = user.getResetToken();//call getResetToken function in model to generate token
    console.log(resetToken);
    await user.save({validateBeforeSave : false})//make validation false for token before save this doc to db

    //create reset Url.here weare using front end url for reset password that is set in environment variable
    //const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`; 

    let BASE_URL = 'process.env.FRONTEND_URL';
    if(process.env.NODE_ENV === 'production')
    {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`; 


    const message = `your password reset url is as follows \n\n ${resetUrl} \n\n If you have not received this email, then ignore`;
     //message sent with email to the user

     try{
       await sendEmail({//call function in email util fn tosend email
            email : user.email,//to get user emai id
            subject : "ECart Password Recovery",//subject send with email
            message  //print above msg in email
        })
        //these are the arguments passing to the options object in send email fn in utils file
        
        res.status(200).json({//success msg
            success : true,
            message : `email sent to ${user.email}`
        })
    }

        catch(error)//print error msg if email is not sent
        {
            user.resetPasswordToken = undefined;
            user.resetpasswordtokenexpire = undefined;
            //empty the token field in db

            await user.save({validateBeforeSave : false});
            return next(new ErrorHandler(error.message),500);

        }
    })

    //resetpassword - {{base_url}}/api/v1/password/reset/:token -post
    exports.resetPassword = catchAsyncError(async(req, res, next) =>{
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        console.log(resetPasswordToken);
   
        const user =await User.findOne({
            resetPasswordToken,
            resetpasswordtokenexpire : {//expire fn declared in model
                $gt :Date.now()//greater than current date
            
            }
             })

            if(!user)//user not found
            {
                return next(new ErrorHandler('password reset token is invalid or expired'));
            }

            //enter new password and confirm password and check for match
            if(req.body.password !== req.body.confirmpassword)
            {
                return next(new ErrorHandler('password doesnot match',400));
            }

            //if password matched
            user.password = req.body.password;//then assign newpassword to password field in db
            user.resetPasswordToken = undefined;//empty the two fields in db
            user.resetpasswordtokenexpire = undefined;//db fields are only deleted but original token is  still avilable in url
            await user.save({validateBeforeSave : false});//call save fun

            sendToken(user,201,res);//set the token in cookie to verify the user.
        })

        //get user profile - {{base_url}}/api/v1/myProfile -get
        exports.getUserProfile = catchAsyncError(async(req, res, next) =>{
            const user = await User.findById(req.user.id);
            //get the user data by id.req.user is already defined in authenticate.js

            res.status(200).json({
                success : true,
                user
            })
        })

        //changePassword-{{base_url}}/api/v1/changePassword-put
        exports.changepassword = catchAsyncError(async(req, res, next) =>{
            const user = await User.findById(req.user.id).select('+password');

                //check the old password is correct
            if(!await user.isValidPassword(req.body.oldPassword))
            {
                return next(new ErrorHandler('Old password is incorrect',401));
            }

            user.password = req.body.newPassword;//assign new password
            await user.save();//save the document after update

            //success msg
            res.status(201).json({
                success : true
            })
        })

        //updateProfile-{{base_url}}/api/v1/updateProfile-put
        exports.updateProfile = catchAsyncError(async(req, res, next) =>{
            //get new data
            //here we changed const into let to update datas 
            let newUserData = {
                name : req.body.name,
                email : req.body.email
            }

            //get avatar image
            let avatar;//initially undefined
            if(req.file)
            {
                avatar = `${req.protocol}://${req.host}/uploads/user/${req.file.originalname}`
            /*
            here we set url for avatar
            req.protocol - http
            req.host - localhost:3030
            req.file.originalname - original name of file that we seleted
            */
                newUserData = {...newUserData,avatar}
            }

            //update data
            const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
                //here update function will automatically update the data there is no need to write save function
                new : true,//to return only updated data
                runValidators : true//run validation for new data
            })

            //sucess msg
            res.status(201).json({
                success : true,
                user
            })
     })

     //Admin Functions
     //get all users-{{base_url}}/api/v1/admin/Users
     exports.getAllUsers = catchAsyncError(async(req, res, next) =>{
        const users = await User.find();//find - get all docs

        //sucess
        res.status(200).json({
            success : true,
            count : users.length,
            users//print all users data
        })
     })

     //getSingleUser-{{base_url}}/api/v1/admin/getUser/:id-get
     exports.getSingleUser = catchAsyncError(async(req, res, next) =>{
        const user = await User.findById(req.params.id);
        //here req.params.id is used toget the id from url becoz admin can directly put the id in url

        if(!user)
        {
            return next(new ErrorHandler('User Not Found',404));
        }

        res.status(200).json({
            success : true,
            user
        })
        
    })

     //updateUser-{{base_url}}/api/v1/admin/updateUser/:id-put
        exports.updateUser = catchAsyncError(async(req, res, next) =>{
            //get new data
            const newUserData={
                name : req.body.name,
                email : req.body.email,
                role : req.body.role
            }

            //update data
            const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
                //here update function will automatically update the data there is no need to write save function
                new : true,//to return only updated data
                runValidators : true//run validation for new data
            })

            res.status(201).json({
                success : true,
                user
            })
        })

        //DeleteUser-{{base_url}}/api/v1/admin/deleteUser/:id-delete
        exports.deleteUser = catchAsyncError(async(req, res, next) =>{
            const user = await User.findById(req.params.id);

            if(!user)
            {
                return next(new ErrorHandler(`user not found with this id ${req.params.id}`,404));
            }

            await user.deleteOne();//here user is a variable that contains single document

            res.status(200).json({
                success : true,
                message : 'user deleted successfully'

            })
        })