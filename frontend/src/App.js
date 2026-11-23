import {
    loginFail, 
    loginRequest, 
    loginSuccess, 
    clearError,
    registerRequest,
    registerSuccess,
    registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail, 
    logoutSuccess,
    logoutFail,
    updateProfileSuccess,
    updateProfileFail,
    updateProfileRequest,
    updatePasswordRequest,
    updatePasswordFail,
    updatePasswordSuccess,
    forgotPasswordRequest,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail,
    forgotPasswordSuccess,
    forgotPasswordFail
}  from '../slices/authSlice';//import login request from slices
import axios from 'axios';// to connect backend api we use this middleware

export const login = (email,password) => async (dispatch) => {
    //pass two parameters email and password
    //dispatch function send the action to the reducer to update the state
    try{
        //try -  perform login action before that we need to send a request so we use the next code
        
        //here we call first action -loginRequest
        dispatch(loginRequest())

        //here we send data using post method with loginapi for authentication contains email and password
        //get data field from result using object destructuring method
        const { data } = await axios.post(`/api/v1/login`,{email,password});

        //call second action.then we send data as a payload to second action
        dispatch(loginSuccess(data))

    }
    catch(error){
        dispatch(loginFail(error.response.data.message))
        //third action shows error message if authentication failed.here message is a field in error response of backend
    }
}

export const clearAuthError =() => dispatch => {
    dispatch(clearError())
}

export const register = (userData) => async (dispatch) => {
    //pass userData
    //dispatch function send the action to the reducer to update the state
    try{
        //try -  perform login action before that we need to send a request so we use the next code
        
        //here we call first action -loginRequest
        dispatch(registerRequest())

        //userData argument contains multiple data and its include images so  here we create config 
        const config = {
            headers: {
                'Content-type' : 'multipart/form-data'
            }
        }

        //here we send data using post method with loginapi for authentication contains email and password
        //get data field from result using object destructuring method
        const { data } = await axios.post('/api/v1/register', userData, config);

        //call second action.then we send data as a payload to second action
        dispatch(registerSuccess(data))

    }
    catch(error){
        dispatch(registerFail(error.response.data.message))
        //third action shows error message if authentication failed.here message is a field in error response of backend
    }
}

//after sucessfull login get userdatas from db and keep loaded in website
export const loadUser = async (dispatch) => {
    //function to get userData from db
    //dispatch function send the action to the reducer to update the state
    try{
        //try -  perform login action before that we need to send a request so we use the next code
        
        //here we call first action -loginRequest
        dispatch(loadUserRequest())
    
        const { data } = await axios.get(`/api/v1/myprofile`);

        //call second action.then we send data as a payload to second action
        dispatch(loadUserSuccess(data))

    }
    catch(error){
        dispatch(loadUserFail(error.response.data.message))
        //third action shows error message if authentication failed.here message is a field in error response of backend
    }
}

//for logout
export const logout = async (dispatch) => {
    
    try{
        //try -  perform logout action 
         await axios.get(`/api/v1/logout`);

        //call logoutSucess reducer
        dispatch(logoutSuccess())

    }
    catch(error){
        dispatch(logoutFail())
        //third action shows error msg
    }
}


//Edit Profile
export const updateProfile = (userData) => async (dispatch) => {
    //get userData that we updated
    //dispatch function send the action to the reducer to update the state
    try{
        //try -  perform login action before that we need to send a request so we use the next code
        
        //here we call first action -loginRequest
        dispatch(updateProfileRequest())

        //userData argument contains multiple data and its include images so  here we create config 
        const config = {
            headers: {
                'Content-type' : 'multipart/form-data'
            }
        }

        //here we send data using post method with loginapi for authentication contains email and password
        //get data field from result using object destructuring method
        const { data } = await axios.put(`/api/v1/updateProfile`, userData, config);

        //call second action.then we send data as a payload to second action
        dispatch(updateProfileSuccess(data))

    }
    catch(error){
        dispatch(updateProfileFail(error.response.data.message))
        //third action shows error message if authentication failed.here message is a field in error response of backend
    }

}

//update Password
export const updatePassword = (formData) => async (dispatch) => {
    //get userData that we updated
    //dispatch function send the action to the reducer to update the state
    try{
        //try -  perform login action before that we need to send a request so we use the next code
        
        //here we call first action -loginRequest
        dispatch(updatePasswordRequest())

        //usually wwe use formdata here so it automatically displayed as multipart data so we have to change it to application form data
         const config = {
            headers: {
                'Content-type' : 'application/json'//it doesnt include images
            }
        }

        //change password using put method 
        await axios.put(`/api/v1/changePassword`,formData,config);

        dispatch(updatePasswordSuccess())

    }
    catch(error){
        dispatch(updatePasswordFail(error.response.data.message))
        //third action shows error message if authentication failed.here message is a field in error response of backend
    }
}


//forgotPassword
export const forgotPassword = (formData) => async (dispatch) => {
    //get email
    //dispatch function send the action to the reducer to update the state
    try{
         //here we call first action -forgetPassword Request
        dispatch(forgotPasswordRequest())

        //usually we use formdata here so it automatically displayed as multipart data so we have to change it to application form data
         const config = {
            headers: {
                'Content-type' : 'application/json'//it doesnt include images
            }
        }

        //change password using put method 
        const { data } = await axios.post(`/api/v1/password/forgot`,formData,config);

        dispatch(forgotPasswordSuccess(data))

    }
    catch(error){
        dispatch(forgotPasswordFail(error.response.data.message))
        //third action shows error message if authentication failed.here message is a field in error response of backend
    }
}


//Reset Password
export const resetPassword = (formData, token) => async (dispatch) => {
    //get new password,confirm password and token 
    //dispatch function send the action to the reducer to update the state
    try{
         //here we call first action -forgetPassword Request
        dispatch(resetPasswordRequest())

        //usually we use formdata here so it automatically displayed as multipart data so we have to change it to application form data
         const config = {
            headers: {
                'Content-type' : 'application/json'//it doesnt include images
            }
        }

        //change password using put method 
        const { data } = await axios.post(`/api/v1/password/reset/${token}`,formData,config);

        dispatch(resetPasswordSuccess(data))

    }
    catch(error){
        dispatch(resetPasswordFail(error.response.data.message))
        //third action shows error message if authentication failed.here message is a field in error response of backend
    }
}