const app = require('./app');//to import express methods

//dotenv.config({path:"config/config.env"});//absolute path its not working during run time

const path =require('path');//path-node modules to connect config.env file

const connectDatabase = require('./config/database');//connect database
connectDatabase();//connecting function in database

//to check the http server is listening to the port
//here assign app.listen function to server variable
const server = app.listen(process.env.PORT,()=>{
    console.log(`my server listening to the port ${process.env.PORT} in ${process.env.NODE_ENV}`)
})

//to handle unhandledRejection Error
process.on('unhandledRejection',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log('shutting down the server due to unHandled Rejection Error');
    server.close(()=>{
        process.exit(1);
    
    })
})
/*
on-event listener to listen all events
unhandledRejection - if there is no catch code to handle error is called unhandled rejection
err.message - contains error msg
server.close() - close the server
process.exit(1) - close nodejs program
*/

//handle uncaughtexception error
process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log('shutting down the server due to uncaughtException Error');
    server.close(()=>{
        process.exit(1);
    
    })
})

//console.log(a);
//this is uncaught exception error because the variable a is not defined anywhere in the prgm