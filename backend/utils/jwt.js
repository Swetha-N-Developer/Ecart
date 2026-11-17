const sendToken =(user,statusCode,res)=>{

    const token = user.getJwtToken();//this function is defined in userModel.js

    //setting cookies
    const options ={
        expires : new Date(Date.now()+process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),//this set the expires time of cookie
        httpOnly : true//only server can read the cookie
    }

    res.status(statusCode)
       .cookie('token',token,options)//cookie function is used to create cookie
       .json({
        success : true,
        token,//set the cookie iin browser
        user//print user details
        
    })
}
module.exports = sendToken;