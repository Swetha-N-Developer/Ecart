const express = require('express');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

const { newOrder, getSingleOrder, getSingleUserOrder, orders, updateOrder, deleteOrder } = require('../controllers/orderController');

const router = express.Router();

//user Routes
router.route('/orders/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/orders/myorders').get(isAuthenticatedUser,getSingleUserOrder);

//Admin Routes
router.route('/orders').get(isAuthenticatedUser,authorizeRoles('admin'),orders);
router.route('/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder)
                          .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder);


module.exports = router;

