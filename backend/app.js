const express = require('express');//to use express js

const app = express();//create an object called app that contains all express methods

const products = require('./routes/products');//setting the path of product route

const auth = require('./routes/auth');//user route

const Orders = require('./routes/orders');//orders route




const errorMiddleware = require('./middlewares/error');//import  the error middleware

const cookieParser = require('cookie-parser');//import cookie parser- to acces the data in cookie to get id

const path = require('path');

const dotenv = require('dotenv');// to access environment variables in config.env file


dotenv.config({path:path.join(__dirname,"config/config.env")})//relative path it works

const payment = require('./routes/payment');//payment route

app.use(express.json());//it tells monogodb its an json input 
app.use(express.urlencoded({ extended: true }));

app.set('query parser', 'extended');

app.use(cookieParser());

app.use('/uploads',express.static(path.join(__dirname,'uploads')))
//to make uploads folder static

app.use('/api/v1',products);
//here products is an const mention as above to access all routes in route files
//here app is  an express application and use is the middle ware function to access particular uri api/v1 is the base path.v1-version1

app.use('/api/v1',auth);

app.use('/api/v1',Orders);

app.use('/api/v1',payment);

// for deployment of website -connect backend to frontend build folder
if(process.env.NODE_ENV === 'production'){
    //access build folder in frontend
   app.use(express.static(path.join(__dirname,'../frontend/build')))

   //access frontend routes.
    app.get('/{*splat}',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'../frontend/build/index.html'))
        //index.html in build contains main.js it contains all js files
    })
}


app.use(errorMiddleware);



module.exports = app;//export the app object to use express methods in another files