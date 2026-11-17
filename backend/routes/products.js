const express = require('express');// by only using express js we can create a route in nodejs
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productsController');
const router = express.Router();//here we create a router object express router function
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');//only loggined users can access the routes  

router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct);
//console.log(authorizeRoles);
//here newProduct is a handler function and post is a http method used to create a product in database

router.route('/products').get(getProducts);
//set a path /products it will go to the getproducts handler function in controller
//isAuthenticatedUser - middleware function -authorized users can acces get products

router.route('/product/:id').get(getSingleProduct);
router.route('/admin/product/:id')
                            //.get(isAuthenticatedUser,authorizeRoles('admin'),getSingleProduct)
                            .put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct)
                            //put-update the data in database
                            //this is the chain method to define the route but the http methods will differ
                            .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct);

router.route('/review').put(isAuthenticatedUser,createReview);
router.route('/reviews').get(isAuthenticatedUser,getReviews);
router.route('/review').delete(deleteReview);

module.exports = router; //to use the router in all files we export router object