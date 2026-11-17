module.exports = (err, req, res, next)=>{//err- error object received from controller
    err.statusCode = err.statusCode || 500;
    //assign the statuscode to 500 if no error code specified in controller

    //to display error message
    //development stage
    if(process.env.NODE_ENV == 'development')
    {
    res.status(err.statusCode).json({
        success : false,
        message : err.message,
        stack : err.stack,
        error :err
    })
    }
    if(process.env.NODE_ENV == 'production')
    {//in production the stack error msg should not be displayed
        let message = err.message;
        //here err means error object from controller.It displays normal message

       // let error = {...err};//this is spread operator to copy all messages to error variable

        error = new Error(message);

        //validation Error
        if(err.name == "ValidationError")//name = ValidatorError is the field in postman error :err msg
        {
            message = Object.values(err.errors).map(value=>value.message);
            /*
            object.values - accesss all values in error:err postman msg
            err.errors -access the errors field in error:err postman msg
            map function - get all values field from postman error msg as an array
            */

            error = new Error(message);//access the inbuilt nodejs error object
            err.statusCode=400;
        }

        //cast error
        if(err.name == 'CastError')
        {//name=castError is the field in error msg of development in postman
            message = `Resource not found : ${err.path}`;//err.path - we tell the path where the error occurs.path is the field in dev error msg 
            error = new Error(message);//to pass error to error msg
             err.statusCode = 400;

        }

        //duplicate email error,this error code is for all fields that has unique key in validation field
        if(err.code ===  11000)//this code is in error response
        {
            let message =`Duplicate ${Object.keys(err.keyValue)} error`;
            //object - to acces keys in error response of postman.keyvalue-key field in response
            error = new Error(message);//to pass error to error msg
             err.statusCode=400; 
        }

        //when jWT is not valid
        if(err.name =='JSONWEBTOKENERROR')
        {
            let message = 'JSON WEB TOKEN is invalid try again';
            error = new Error(message);
             err.statusCode = 400; 
        }

        //To handle JWT expire error
        if(err.name == 'TokenExpiredError')
        {
            let message = 'JSON WEB TOKEN is expired try again';
            error = new Error(message);
             err.statusCode = 400; 
        }

        res.status(err.statusCode).json({
            success : false,
            message : error.message || 'Internal Server Error'
            //message
        })

        

    
    }
    
}