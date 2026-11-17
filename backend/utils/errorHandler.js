class ErrorHandler extends Error
{
    constructor(message,statusCode)
    //this constructor is automatically once the object is created in controller class
    {
        super(message);//message=product not found
        //super class- Error.it passes the message to error class

        this.statusCode = statusCode;//statusCode =400;

        Error.captureStackTrace(this,this.constructor);
        /*Error → The built-in JavaScript Error class.
          captureStackTrace() → Creates and attaches a stack trace to the error object.stacktarace means it tells at which line, which file the error occurs
          this → The current custom error object (ErrorHandler instance).
          this.constructor → Refers to the ErrorHandler constructor and tells Node.js to omit it from the stack trace to avoid repeated constructor class
        */
    }

}
module.exports=ErrorHandler;