import {Fragment, useEffect, useState} from 'react';
import MetaData from '../layouts/MetaData';
import { clearAuthError, login } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify';//show error alerts with css
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Login(){
    const [email,setEmail] = useState("");
    //set state for email inputbox to get email value

    const [password,setPassword] = useState("");
    //set state for password inputbox to get password value

    const [errors, setErrors] = useState({});
    //set error state for frontend validation

    const dispatch = useDispatch();
    //useDispatch hook is used to send action data to redux store(store.js) then store send an action to reducer to update state

    const navigate = useNavigate();
    //useNavigate hook is used to move to next page

    const location = useLocation();
    //to access redirect parameter in url

    const redirect = location.search ? '/'+location.search.split('=')[1]:'/';
    /*
      ternary operator - if redirect exists it goes to redirected page or it goes to home component
      location.search - it gets the query string from current Url
      '/'+location.search.split('=')[1] - add / before redirect value.here split splits the string ?redirect = shipping as [?redirect,shipping]
      arrav value is[0,1] (result - '/shipping')
      '/' - home component
    */

    const { loading, error, isAuthenticated } = useSelector(state => state.authState)
    /*
    useSelector hook access the value in redux extension tools
    by destructuring method we get only loading value from authState
    we need loading value to disable login button while loading is true
    */


    //define submitHandler()
    const submitHandler = (e) =>{
        e.preventDefault(); //to stop refresh of page after click submit button
       
        //call validateField Function for frontend validation
        const emailError = validateField("email", email);
        const passwordError = validateField("password", password);

        if (emailError || passwordError) {
          return;//if any one of error exists it will stop the next code execution
          }

        dispatch(login(email,password));
        /*
        here we send both email & password values to actions
        login is a function in userActions
        dispatch is used to send action datas from login function to redux store
        */
        }

        //frontend validation function
        const validateField = (name, value) => {
          /*
          name-input field name
          value - input field value
          */


    let error = "";//initially error state is empty

    if (name === "email") {
      //if email exists

        if (value.trim() === "") {
            error = "Email is required";
        }
        else if (value.trim().length < 5) {
            error = "Email must contain at least 5 characters";
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Please enter a valid email address";
        }
    }

    //password field validation

    if (name === "password") {

        if (value === "") {
            error = "Password is required";
        }
    }
    /*
    if (name === "password") {

        if (value === "") {
            error = "Password is required";
        }
        else if (value.length !== 8) {
            error = "Password must contain exactly 8 characters";
        }
        else if (!/[A-Z]/.test(value)) {
            error = "Password must contain one capital letter";
        }
        else if (!/[0-9]/.test(value)) {
            error = "Password must contain one number";
        }
        else if (!/[^A-Za-z0-9]/.test(value)) {
            error = "Password must contain one special character";
        }
    }
  */

    //update error state with values
    setErrors(prevErrors => ({
        ...prevErrors,//if i move from email to pwd field it also preserves the email error
        [name]: error//password : pwd error.this is called computational property
    }));

    return error;//pass the errorvalues where validateField function calls
};


// 1. Background image effect
    useEffect(() => {

        document.body.style.backgroundImage = "url('/images/loginBG.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";

        return () => {
            document.body.style.backgroundImage = "";
            document.body.style.backgroundSize = "";
            document.body.style.backgroundPosition = "";
            document.body.style.backgroundRepeat = "";
            document.body.style.backgroundAttachment = "";
        };

    }, []);



    //show erroralert.useEffect hook to fetch data
    useEffect(() => {
        if(isAuthenticated){
            navigate(redirect)
            //if redirect value in url it goes to redirect page or it goes to home page
        }

        if(error){
            toast(error,{
            position : "bottom-center",
            type : 'error',//to show error toast
            onOpen :()=>{ dispatch(clearAuthError)}
            //clear previous email id and password after login in login page we supposed to create reducers in authslice
            })
            return //return doesnot execute any other functions
        }
    },[error,isAuthenticated, dispatch, navigate, redirect])
    /*
    error is dependency. so useEffect will listen to errors 
    if error occurs then show error alerts based on the conditions we mentioned.
    */

    return(
        <Fragment>
            <MetaData title={`Login`}/>{/*to change the title of login page */}
        <div className="row wrapper"> 
		<div className="col-10 col-lg-5">
       
        <form onSubmit={submitHandler} className="shadow-lg" noValidate>
            {/*create submitHandler to get email and password input values from inputbox */}
            <h1 className="mb-3">Login</h1>
            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                name="email"
                className="form-control"
                //to get values while typing
                value={email}//variable of useState
                onChange={(e) =>{ 
                  setEmail(e.target.value);
                  validateField("email",e.target.value)//pass arguments get from input fileld to validate Field function
                }//fn in setEmail
              }
              />
               {errors.email && (//if email error exists
                  <p className="error-message">
                      *{errors.email}
                  </p>
    )}
            </div>
  
            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                  
                onChange={(e) =>{ 
                  setPassword(e.target.value);
                  validateField("password",e.target.value)
                }//fn in setEmail
              }
              />
               {errors.password && (
                  <p className="error-message">
                      *{errors.password}
                  </p>
              )}
            </div>

            <Link to ="/password/forgot/"  className="float-right mb-4">Forgot Password?</Link>
  
            <button
              id="login_button"
              type="submit"
              className="btn btn-block py-3"
              disabled = {loading}
              /*
              loading true means disabled=true
              loading false means disabled = false
              */
            >
              LOGIN
            </button>

            <Link to="/register" className="float-right mt-3">New User?</Link>
          </form>
		  </div>
        </div>

     </Fragment>
    )
}