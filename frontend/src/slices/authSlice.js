import { createSlice } from "@reduxjs/toolkit";
//slice is created for all products.here reducer function is defined for all products state

const authSlice = createSlice({
    name :'auth',
    initialState :{
        loading : true,//initially load symbol is true
        isAuthenticated : false//this field only whether the user id logged in intially set to false

        
    },

    //login
    //backend work - it gets email and password, then checks whether it is valid in db after that it returns user data
    reducers:{
        //state1-> send request for  login to user account
        loginRequest(state,action)
        {
            return{
                ...state,//spread operator - it gets all initial state data 
                loading : true,//but we change loading state only so loading symbol is shown on website
               }
        },

        //state2-> after login success
        loginSuccess(state,action){
            return{
                loading: false,//loading symbol is not shown
                isAuthenticated :true,
                user : action.payload.user
                //payload-fetched userdata fom db(state data),user- field in database
              
            }
        },

        //state-3 -> when login failed
        loginFail(state,action){
            return{
                ...state,//it loads only initial state values
                loading :false,
                error : action.payload//error is an error field in state that shows errors

            }
        },

        //clearError reducer clears previous error and data in login text boxes
        clearError(state,action){
            return{
                ...state,//it loads only initial state values
                error : null//clear errors

            }
        },

        //reducers for load user(load user data once login if we refresh the page it shouldnot logout)
        //state1-> send request to load user data
        loadUserRequest(state,action)
        {
            return{
                ...state,//spread operator - it gets all initial state data 
                isAuthenticated : false,
                loading : true,//but we change loading state only so loading symbol is shown on website
               }
        },

        //state2-> userdata loaded when authentication true
        loadUserSuccess(state,action){
            return{
                loading: false,//loading symbol is not shown
                isAuthenticated :true,
                user : action.payload.user
                //payload-fetched userdata fom db(state data),user- field in database
              
            }
        },

        //state-3 -> userdata not loaded
        loadUserFail(state,action){
            return{
                ...state,//it loads only initial state values
                loading :false,
               // error : action.payload//error is an error field in state that shows errors

            }
        },

         //reducers for registeration
         //backend work - get user details and return user data
        //state1-> send request for  login to user account
        registerRequest(state,action)
        {
            return{
                ...state,//spread operator - it gets all initial state data 
                loading : true,//but we change loading state only so loading symbol is shown on website
               }
        },

        //state2-> after login success
        registerSuccess(state,action){
            return{
                loading: false,//loading symbol is not shown
                isAuthenticated :true,
                user : action.payload.user
                //payload-fetched userdata fom db(state data),user- field in database
              
            }
        },

        //state-3 -> when login failed
        registerFail(state,action){
            return{
                ...state,//it loads only initial state values
                loading :false,
                error : action.payload//error is an error field in state that shows errors

            }
        },


        //for logout
        //it returns message loggedout
        logoutSuccess(state,action){
            return{
                loading: false,//loading symbol is not shown
                isAuthenticated :false,//logout
               }
        },

    
        logoutFail(state,action){
            return{
                ...state,//it loads only initial state values
                error : action.payload//error is an error field in state that shows errors
             }
        },

        //Edit profile
        //backend work - after update profile if it is updated it will show user details 
        updateProfileRequest(state,action)
        {
            return{
                ...state,//spread operator - it gets all initial state data 
                loading : true,//but we change loading state only so loading symbol is shown on website
                isUpdated : false
            }
        },

        //state2-> update success
        updateProfileSuccess(state,action){
            return{
                ...state,
                loading: false,//loading symbol is not shown
                isAuthenticated :true,
                user : action.payload.user,
                //payload-updated data
                isUpdated : true//to check the profile is updated or not
              
            }
        },

        //state-3 -> update failed
        updateProfileFail(state,action){
            return{
                ...state,//it loads only initial state values
                loading :false,
                error : action.payload//error is an error field in state that shows errors

            }
        },

        //clear isupdated:true after profile updated
        clearUpdateProfile(state,action)
        {
            return{
                ...state,
                isUpdated : false
            }
        },

        //update Password(password change)
        //backend work - it will ask for old password and new password it will check for old password exists if exists it return true msg
         updatePasswordRequest(state,action)
        {
            return{
                ...state,//spread operator - it gets all initial state data 
                loading : true,//but we change loading state only so loading symbol is shown on website
                isUpdated : false
            }
        },

        //state2-> update success
        updatePasswordSuccess(state,action){
            return{
                ...state,
                loading: false,//loading symbol is not shown
                isAuthenticated :true,
               //in this we remove the code because response from db contains only success:true it doesnt return any user object
               //  user : action.payload.user,
                //payload-updated password
                isUpdated : true//to check the profile is updated or not
              
            }
        },

        //state-3 -> update failed
        updatePasswordFail(state,action){
            return{
                ...state,//it loads only initial state values
                loading :false,
                error : action.payload//error is an error field in state that shows errors

            }
        },


        //forgot password - backend work - it asks for email.it checks whether user exists then return true
         forgotPasswordRequest(state,action)
        {
            return{
                ...state,//spread operator - it gets all initial state data 
                loading : true,//but we change loading state only so loading symbol is shown on website
                message : null //to clear the message field for next request   
            }
        },

        //state2->  success->get email
        forgotPasswordSuccess(state,action){
            return{
                ...state,
                loading: false,//loading symbol is not shown
                message : action.payload.message
             
               }
        },

        //state-3 -> update failed
        forgotPasswordFail(state,action){
            return{
                ...state,//it loads only initial state values
                loading :false,
                error : action.payload//error is an error field in state that shows errors

            }
        },

        //ResetPassword -backend work -(in url it has reset token it matches that token with db then send user data 
        //after that it will asks for new password and confirm password)
         resetPasswordRequest(state,action)
        {
            return{
                ...state,//spread operator - it gets all initial state data 
                loading : true,//but we change loading state only so loading symbol is shown on website
                }
        },

        //state2->  success->
        resetPasswordSuccess(state,action){
            return{
                ...state,
                loading: false,//loading symbol is not shown
                isAuthenticated : true,
                user : action.payload.user  //get user data from action and store it in redux state
                 }
        },

        //state-3 -> update failed
        resetPasswordFail(state,action){
            return{
                ...state,//it loads only initial state values
                loading :false,
                error : action.payload//error is an error field in state that shows errors

            }
        },
    }
});

const { actions,reducer } = authSlice;
//create actions - action names are same as reducer so we get it from productsSlice and save it as action creators

export const {
    loginRequest,
    loginSuccess,
    loginFail,
    clearError,
    registerRequest,
    registerSuccess,
    registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutFail,
    logoutSuccess,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updatePasswordRequest,
    updatePasswordFail,
    updatePasswordSuccess,
    forgotPasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail,
    clearUpdateProfile
} = actions;
//export reducer function to actions

export default reducer;
//now  define all reducers in combinereducers of store.js