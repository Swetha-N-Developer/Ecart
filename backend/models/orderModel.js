const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    shippingInfo :{//object because every user give single address while placing the order
        address : {
            type : String,
            required : true
        },
         country : {
            type : String,
            required : true
        },
         city : {
            type : String,
            required : true
        },
         phoneNumber : {
            type : String,
            required : true
        }, 
        postalCode : {
            type : String,
            required : true
        }
    },
    user :{//get user id who places order
        type :mongoose.SchemaTypes.ObjectId,
        required :true,
        ref : 'User'//reference for user collection becoz the user id can get from user collection
    },
    orderItems:[{//array - users can place different orders on a single id
        name :{
            type : String,
            required : true
         },
         quantity:{
            type : Number,
            required : true
         },

         image :{
            type : String,//String can accept values like "laptop","abc123","123456"
            required : true
         },

         price :{//datatype Number can hold values like integer,float ,double
            type : Number,
            required : true,
            default :0.0
         },
         //get the product id from product collection
         product :{
            type : mongoose.SchemaTypes.ObjectId,
            required : true,
            ref : "products"
         }
    }],
    itemPrice :{
        type : Number,
        required : true,
        default : 0.0
    },
    taxPrice :{
        type : Number,
        required : true,
        default : 0.0
    },
    shippingPrice :{
        type : Number,
        required : true,
        default : 0.0
    },
    totalPrice :{
        type : Number,
        required : true,
        default : 0.0
    },
    // get payment id and status from frontend
    paymentInfo: {
        id:{
            type :  String,
            required : true
        },
        status:{
            type : String,
            required : true
        }
    },
    paidAt: Date,//it is a datatype. It just  tells what type of data should be given and it needs a function call in code
    deliveredAt : Date,
    orderStatus :{
        type:String,
        required : true,
        default : 'Processing'
    },
    createdAt :{
        type : Date,
        default : Date.now//date.now is a function to store current date and time automatically
    }
})
let orderModel = mongoose.model('Order',orderSchema);
module.exports = orderModel;