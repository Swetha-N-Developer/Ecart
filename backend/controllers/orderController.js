const Order = require('../models/orderModel');//import the path of model

const Product = require('../models/productModel');//import the path of model

const User = require('../models/userModel');//User modelname in userModel

const ErrorHandler = require('../utils/errorHandler');//import the path of error handler class

const catchAsyncError = require('../middlewares/catchAsyncError')//import the path of catchAsyncError middleware

//create New Order - {{base_url}}/api/v1/orders/new -post
exports.newOrder = catchAsyncError(async(req, res, next) => {
    const{
        //object destructing - taking values from object in request body and store them directly in variables
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo//its not defined in model so it doesnt stored in database
    }= req.body;

    console.log("ORDER DATA:", req.body);

    //create order
    const order = await Order.create({
       orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt : Date.now(),//call date function to store current date whenever the payment is made
        user : req.user.id //req.user contains the user data in authenticate.js.here we store user id.
    })

    console.log("ORDER SAVED:", order);
    
//success response
res.status(201).json({
    success : true,
    order
})

})


//Get Single Order -{{base_url}}/api/v1/order/:id-get
exports.getSingleOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user','name email');
    /*
    populate - here we display order data with user details like name and email in order to get the name and email of user we need to access the user collection
    so we use populate method to access another collection
    name and email - fields we about to access in user collection
    */

    if(!order)
    {
        return next(new ErrorHandler('order not found with this id : ${req.params.id}',404));
    }

    res.status(200).json({
        success : true,
        order
    })
})

//Get SingleUser Orders -{{base_url}}/api/v1/myorders-get
exports.getSingleUserOrder = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find({user : req.user.id});
    //req.user already contains user details in authenticated user middleware
    //find({user : req.user.id}) -> it gets all users based on user id in users collection
    if(!orders)
    {
        return next(new ErrorHandler(`orders are not found with this id : ${req.user.id}`,404));
    }
    

    res.status(200).json({
        success : true,
        count : orders.length,
        orders
    })
})

//Admin : Get All Orders-{{base_url}}/api/v1/orders
exports.orders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find();
     
    //Total amount shown to admin
    let totalAmount =0;

    //here orders is an array becoz it contains  many orders for single user
    orders.forEach(order =>{ 
    totalAmount += order.totalPrice;
})

res.status(200).json({
    success :true,
    count : orders.length,
    totalAmount,
    orders

})
})


//Admin : Update Order - {{base_url}}/api/v1/order/:id(order_id) -put
exports.updateOrder = catchAsyncError(async(req, res, next) => {
 const order = await Order.findById(req.params.id);

     if(!order)
    {
        return next(new ErrorHandler('order not found with this id : ${req.params.id}',404));
    }

    if(order.orderStatus === 'delivered')
    {
        return next(new ErrorHandler('product has been delivered already',404));
 
    }

    order.orderItems.forEach(orderItem =>{
         updateStock(orderItem.product,orderItem.quantity);
        //call function and pass the arguments
    })

    //assign orderrstatus that get from req.body to db
    order.orderStatus = req.body.orderStatus;

    //assign the date and time of delivery
    order.deliveredAt =Date.now();

    await order.save();//save to after changes

    res.status(200).json({
        success : true,
        
    })

    //function defnition
    async function updateStock(productId,quantity)
    {
        const product =await Product.findById(productId);

        product.stock = product.stock - quantity;

        product.save({validateBeforeSave : false});

    }
})

//admin: DeleteOrder - api/v1/order/:id
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order =await Order.findById(req.params.id);
    //based on order id fetch the order details

    if(!order)
     {//order is not found
        return next(new ErrorHandler('Order not found with this id:',404));
    }

    await order.deleteOne();//if order exists it deletes the placed order

    res.status(200).json({
        success:true
    })
})




