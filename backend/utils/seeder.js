const products = require('../data/products.json');//import the path of product data

const Product = require('../models/productModel');//import the path of model file

const dotenv = require('dotenv');//use dotenv package

dotenv.config({path:'backend/config/config.env'});//import the path of config files to use the data base connection string

//import database details to connect to database.then only wew can do operations in databse data
const connectDatabase = require('../config/database');
connectDatabase();//call connect database function in database.js

const seedProducts = async() =>{
    try
    {
        await Product.deleteMany();//delete many function is used to delete many documents (previous documents)
        console.log('products Deleted');//print the deleted msg in console

        await Product.insertMany(products);// insertMany function is used to insert many documents to database at a time
        console.log('All products addded!');//print the sucess msg in console

        

    }
    catch(error)
    {
        console.log(error.message);
    }
    process.exit();
    //after delete and add products sucessfully the program is still running to stop the program execution we write a code here

}
seedProducts();//call function then only it will be executed

//this seeder.js file run independently without server.js and app.js.so we need to set some commands in  script of package.json
