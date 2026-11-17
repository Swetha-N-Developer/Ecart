const express = require('express');
const multer = require('multer');
const path = require('path')

//create disk siorage for avatar
const upload = multer({storage: multer.diskStorage({
    //storage-disk storage
    destination: function(req,file,cb){
        /*destination - storage folder for avatar
          file - filename 
          cb - call back function */
          cb(null,path.join(__dirname,'..','uploads/user'))
          /*
          null - error
          path.join - destination folder info
           */
    },
    filename : function(req,file,cb){
        //store filename in specified folder what we have in original filename
        cb(null,file.originalname)
    }
    
    })
})


const { 
        registerUser, 
        loginUser, 
        logoutUser, 
        forgetPassword, 
        resetPassword, 
        getUserProfile, 
        changepassword,
        updateProfile,
        getAllUsers,
        getSingleUser,
        updateUser,
        deleteUser
    } = require('../controllers/authController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const router = express.Router();

//user Routes
router.route('/register').post(upload.single('avatar'),registerUser);
/*
    upload - multer function that we declared above
    single - function to upload single file in multer.this file gets a file and send it to upload function
    avatar: - input name that we get from form data
    registerUser - controller function that posts all form datas to db
*/
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgetPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myProfile').get(isAuthenticatedUser,getUserProfile);
router.route('/changePassword').put(isAuthenticatedUser,changepassword);
router.route('/updateProfile').put(isAuthenticatedUser,upload.single('avatar'),updateProfile);

//Admin Routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getSingleUser)
                                .put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
                                .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser);
//console.log(typeof deleteUser);

module.exports = router;