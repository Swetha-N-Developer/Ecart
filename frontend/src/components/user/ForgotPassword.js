import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearAuthError, forgotPassword } from "../../actions/userActions";
import { toast } from "react-toastify";

export default function ForgotPassword(){
    const [email, setEmail] = useState("");
    const [ errors, setErrors] = useState({})

    const dispatch = useDispatch();

    const { error, message } = useSelector(state => state.authState)//get state data

    //front end validation
    const validateField = (name,value) => {
       let Error ="";

        if(name === "email") {

            if(value.trim() === "") {

                Error = "Email is required";

            }else if(value.trim().length < 5){

                Error ="Email must contain atleast 5 characters";

            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {

            Error = "Please enter a valid email address";
        
             }
            }
         //update error state with values
    setErrors(prevErrors => ({
        ...prevErrors,//if i move from email to pwd field it also preserves the email error
        [name]: Error//password : pwd error.this is called computational property
    }));
     return Error;//pass the errorvalues where validateField function calls
};


    const submitHandler = (e) =>{
        e.preventDefault();

         //call validateField Function for frontend validation
        const emailError = validateField("email", email);
       

        if (emailError) {
          return;//if any one of error exists it will stop the next code execution
          }

        const formData = new FormData();
        formData.append('email',email);//get input from input field and store it in db
        dispatch(forgotPassword(formData));//send the value of email to action
    }

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
    

    useEffect(() => {
        if(message)//message in state - token sent to email  
        {
            toast(message,{
                type : 'success',
                position : "bottom-center"
            })
            setEmail("");//clear input field after show sucess msg
            return;
        }

        if(error){
                    toast(error,{
                    position : "bottom-center",
                    type : 'error',//to show error toast
                    onOpen :()=>{ dispatch(clearAuthError())}
                    //clear previous email id and password after login in login page we supposed to create reducers in authslice
                    })
                    return //return doesnot execute any other functions
                }

    },[message, error, dispatch])
    
    return(
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit = {submitHandler} className="shadow-lg" noValidate>
                    <h1 className="mb-3">Forgot Password</h1>
                    <div className="form-group">
                        <label htmlFor="email_field">Enter Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                             onChange={(e) =>{ 
                  setEmail(e.target.value);
                  validateField("email",e.target.value)//pass arguments get from input fileld to validate Field function
                }
            }
                        />
                        {errors.email && (//if email error exists
                  <p className="error-message">
                      *{errors.email}
                  </p>
    )}
                    </div>

                    <button 
                        id="forgot_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Send Email
                    </button>

                </form>
            </div>
        </div>
        
    )
}