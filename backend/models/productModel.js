const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({//schema-object
    name : {
        type : String,//set the datatype
        required :[true,"please enter product name"],//set validation field
        trim : true, //trim the spaces before and end of name,
        maxlength :[100,"product name cannot exceed 100 characters"]
    },
    price : {
        type : Number,
        default : 0.0//if we have the default value we dont need to mention the required field
    },
    description : {
        type : String,
        required : [true,"please enter product description"]
    },
    ratings : {
        type : String,
        default:0,
    },
    images : [
        {
            image : {
                type :String,
                required:true
            }
            
        }
        
    ], 
    category : {
        type :String,
        required :[true,"please enter product category"],
        enum : {//it only accept mentioned items in the list
            values :[
                'Electronics',
                'Mobile phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ]
             },
            message :"please select correct Category"
        },
        seller : {
            type :String,
            required :[true,"please enter product seller"]
        },
        stock : {
            type : Number,
            required :[true,"please enter product stock"],
            maxlength :[20,"products stock cannot exceed 20"]
        },
        numOfReviews : {
            type : Number,
            default:0
        },
        reviews:[
                {
                    user : {
                        type : mongoose.Schema.Types.ObjectId,
                        ref : "users"//refer users table
                    },
                    name : {
                        type : String,
                        required : true
                    },
                    rating : {
                        type : String,
                        required : true
                    },
                    comment : {
                         type : String,
                        required : true
                    }
                }
            ],
           /* user : {
                type : mongoose.Schema.Types.ObjectId //to register the id of user(admin) to indicate who created this product
            },*/
        createdAt : {
            type : Date,
            default : Date.now()
        }
})
let schema = mongoose.model('Product',productSchema);
//mongoose.model tells mongoose take the blueprint of schema and gives us a model file called Product
module.exports=schema;
