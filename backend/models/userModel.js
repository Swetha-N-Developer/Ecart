const mongoose = require('mongoose');
const validator = require('validator');//validation
const bcrypt = require('bcrypt');//password hashing
const jwt = require('jsonwebtoken');//create json web token for authentication
const crypto = require('crypto');//import crypto package 

const userSchema =new mongoose.Schema({//schema - class,userSchema-schema name
    name:{
        type:String,
        required : [true,'please enter name']
    },
    email:{
        type : String,
        required :[true,'Please Enter email'],
        unique : true,
        validate : [validator.isEmail,'please enter valid email']//this is the builtin function of validator package
    },
    password:{
        type:String,
        required :[true,'please Enter password'],
        minlength :[4,'password atleast contain 4 characters'],
        maxlength: [6,'password cannot exceed 8 characters'],
        select:false//this means the password is not available to anyone while fetching user data
    },
    avatar:{
        type : String
        
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken: String,
    resetpasswordtokenexpire : Date,
    createdAt:{
        type : Date,
        default : Date.now
    }
    })

    //hashing password
    userSchema.pre('save',async function(next){
         if (!this.isModified('password')) {
        return next;
    }
        this.password = await bcrypt.hash(this.password,10);
        //10-salt.it is used to add random numbers to the hashing password for more security
        next;//pre saving works finished. continue with the saving document
    })

    //create json web token after registration 
    userSchema.methods.getJwtToken = function(){
        //console.log('function called');
        return jwt.sign({id :this.id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_TIME});
        console.log(process.env.JWT_SECRET)
    }
    /*
    jwt.sign() - built in function to create jwt token with 3 parts 
    payload - user_id
    secret key - we set it in config.env
    options - expires time
    */


    //to compare the hashed passwords
    userSchema.methods.isValidPassword =async function(enteredpassword){
        return await bcrypt.compare(enteredpassword,this.password);
    }
    /*
   isValidPassword-user defined function.entered is an argument get from req.body
   bcrypt.compare -bcrypt functioin that  compare hashed passwords
   */

   //gnerate reset token for forget password
   userSchema.methods.getResetToken = function(){

    //Generate Token
    const token = crypto.randomBytes(20).toString('hex');//20-length,hex - convert it into hexa decimal string
    console.log(token);
    //hashing the token
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    //using sha 256 algorithm hash the reset token .sha256 takes the input and hash the token .digest('hex')-converts the token into hexadecimal code
    //in database resetPassword token contains only hashed passwords

    //set token expire time.expireation time- 30 minutes 60 s 1000ms
    this.resetpasswordtokenexpire = Date.now()+ 30 * 60 * 1000;
    
    return token;//this is unhashed token

   }
const model = new mongoose.model('User',userSchema);
//model - model name,mangoose.model - call mangoose method ,User-model name,userSchema-schema name
module.exports = model;