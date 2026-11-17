const Product = require('../models/productModel');//import the path of model

const ErrorHandler = require('../utils/errorHandler');//import the path of error handler class

const catchAsyncError = require('../middlewares/catchAsyncError')//import the path of catchAsyncError middleware

const APIFeatures = require('../utils/apiFeatures');//import apiFeatures utils

//create Product - /api/v1/admin/product/new
exports.newProduct = catchAsyncError(async(req, res, next)=>{ //catchAsyncError fuction used to handle promise errors.next is a function used to use next middleware
    //console.log("request Received");

    req.body.user = req.user.id;
    //req.user - contains the user details after login so req.user.id - get the id from user data
    //req.body.user - assign the id to user in req.body

    let product = await Product.create(req.body);
    //console.log("Product Created");
   
    //if any occurs it throws the error to catchAsyncError middleware file
    //Product-model,product - variable
    //create is a function  used to create one document at a time
    //req.body is used to send the product data to database in request body

    res.status(201).json({
        //res-object,status-function,201-error code for  product sucessfully created message
        success : true,
        product //this is the model contains returned saved data
    })
});

/*Get Product - /api/v1/products
exports.getProducts = async(req, res, next)=>{
    let products = await Product.find();//find function is used to get datas from database
    res.status(200).json({//200 error code-ok
        success : true,
        count : products.length,//get the count of documents
        products
    })
}*/


//getproducts - api/v1/products
//search- api/v1/products?keyword=dell
exports.getProducts = catchAsyncError(async(req, res, next)=>{

    const resPerPage = 3;//resperpage - response per page in db =2(pagination)

    //const apiFeatures = new APIFeatures(Product.find(),req.query).search().filter().paginate(resPerPage);
    //creating object called apiFeatures as well as call the constuctor and passing arguments to the constructor in apiFeatures class in utils file
    
   //asign filter and pagination queries to build query
    let buildQuery =()=>{
    return new APIFeatures(Product.find(),req.query)
    .search()
    .filter(); 
   }

   //count filtered products 
   const filteredProductsCount = await buildQuery().query.countDocuments({});

   //count filtered products
   const totalProductsCount = await Product.countDocuments({});

   let productsCount = totalProductsCount;
   //assign total count to products count

   if(filteredProductsCount !== totalProductsCount)
   {
    productsCount = filteredProductsCount;
   }

   //const products = await apiFeatures.query;//this contains the searched result

   const products = await buildQuery()
   .paginate(resPerPage)
   .query;
   //get products with pagination

    await new Promise(resolve =>setTimeout(resolve,1000))//set delay for fetching products data in 3secs to display loader in front end 
    //return next(new ErrorHandler('unable to send Products!',400));

    

    res.status(200).json({//200 error code-ok
        success : true,
        count : productsCount,//get the count of all documents in db
        resPerPage,
        products//it prints the result
    })
});


//Get Single Product - /api/v1/product/:id
exports.getSingleProduct = async(req, res, next)=>{
    let product = await Product.findById(req.params.id);
    //findByID - get the sinfle document based on specified id
    //req.params.id - get the id from url

    /*if(!product)
    {//if product not available 

        return res.status(404).json({//404 - not found
            success : false,
            message :"product not found"
        })
    }
    */

        //handle errors with Error Handler class

    if(!product)//product not available
    {
        return next(new ErrorHandler('product not found',400));
        /*
        new ErrorHandler creates an object
        {
        message:'server not found',
        status code:400,
        stack : errorcode...
        }
        this object is called the error object.this error object is created by ErrorHandler Class
        so once the object is created it automatically calls constructor in ErrorHandler class 

        next-calls error middleware with error object
        */
       }
       //sucess response
       res.status(201).json({//201- create 
        success : true,
        product
    })
}

//UpdateProduct - /api/v1/product/:id
exports.updateProduct = async(req, res, next)=>{
    let product = await Product.findById(req.params.id);
    //findByID - get the sinfle document based on specified id
    //req.params.id - get the id from url

    if(!product)
    {
        return res.status(404).json({//404 - not found
            success : false,
            message :"product not found"
        });
    }

product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new : true,//to check  the updated data saved
        runValidators : true//this validats the new data based on rules we set in schema 
    });
    //findByIdAndUpdate - update the edited data
    //req.body - send the updated data to the database

    res.status(200).json({//200- ok
        success : true,
        product
    })
}

//UpdateProduct - /api/v1/product/:id
exports.deleteProduct = async(req, res, next)=>{
    let product = await Product.findById(req.params.id);
    //findByID - get the single document based on specified id
    //req.params.id - get the id from url

    if(!product)
    {
        return res.status(404).json({//404 - not found
            success : false,
            message :"product not found"
        });
    }

    //Product - model.so we can use functions like(find(),findByID(),findByIdAndDelete())
    //product - document.we can use only save(),deleteOne() function

await product.deleteOne();
    //deleteOne - delete the data from database
    //remove() works only in older versions.
    
   
    res.status(200).json({//200- ok
        success : true,
        message : "product Deleted"
    });
}

//create review -put - {{base_url}}/api/v1/review
exports.createReview = catchAsyncError(async(req,res,next)=>{
    const{productId,rating,comment} = req.body;
    //get datas from request body

    const review ={
        user : req.user.id,
        rating,
        comment
    }
    //to push the data in review array of db 

    const product = await Product.findById(productId);
    //get the product details and store it in product variable

    const isReviewed = product.reviews.find(review =>
        {
            return review.user.toString() == req.user.id.toString()
            //this checks the logged in user and user id in productfield are same
        })
        /*
        reviews-  array data in db.
        user- user variable contains the user id in db 
        */

        if(isReviewed)
            //if isReviewed is true, that means thw review is already exists for the user,then update comment and rating
        {
            product.reviews.forEach(review=>{
                if(review.user.toString() == req.user.id.toString())
                {
                    review.comment = comment
                    review.rating = rating
                    //update comment and rating
                }
            })

        }
         else{
            product.reviews.push(review);
            //using push method to create new array in reviews 

            product.numOfReviews = product.reviews.length;
            //update number of reviews field

             }

            //find the avg of product reviews
         product.ratings =product.reviews.reduce((acc,review)=>
            {
                return Number(review.rating)+acc;   
            },0)/product.reviews.length;

            /*reduce-> function used in array to reduce the multiple array values in single value
        */

            product.ratings = isNaN(product.ratings)?0:product.ratings;
            /*
            suppose product.review.length is empty then it returns NaN error to avoid this we use the above code
            isNaN -> true->0
            isNaN -> false -> product.ratings
            */

            //save in db
            await product.save({validateBeforeSave : false});

            res.status(200).json({
                success:true
            
            })
})

//getReviews = {{base_url}}/api/v1/reviews?id=productid - get
exports.getReviews = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    //its a query string to get the product details from product id

    res.status(200).json({
        success:true,
        reviews : product.reviews
    })
})

//deleteReview
exports.deleteReview = catchAsyncError(async(req,res,next)=>{

    const product = await Product.findById(req.query.productId);
    //get product id from query parameters

    const reviews = product.reviews.filter(review=>{
        return review._id.toString()!== req.query.id.toString();
    })
    //reviews constant contains all array user reviews except logged in user

    const numOfReviews = reviews.length;
    //calculate total number of reviews

    let ratings = reviews.reduce((acc,review)=>{return review.rating+acc;

    },0)/reviews.length;
    //calculate total ratings

    ratings = isNaN(ratings)?0:ratings;
    
    await Product.findByIdAndUpdate(req.query.productId,
        {
            reviews,
            numOfReviews,
            ratings
        })

        res.status(200).json({
            success:true
        })

})





