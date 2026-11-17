import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearAuthError, forgotPassword } from "../../actions/userActions";
import { toast } from "react-toastify";

export default function ForgotPassword(){
    const [email, setEmail] = useState("");

    const dispatch = useDispatch();

    const { error, message } = useSelector(state => state.authState)//get state data

    const submitHandler = (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('email',email);//get input from input field and store it in db
        dispatch(forgotPassword(formData));//send the value of email to action
    }

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
                    onOpen :()=>{ dispatch(clearAuthError)}
                    //clear previous email id and password after login in login page we supposed to create reducers in authslice
                    })
                    return //return doesnot execute any other functions
                }

    },[message, error, dispatch])
    
    return(
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit = {submitHandler} className="shadow-lg">
                    <h1 className="mb-3">Forgot Password</h1>
                    <div className="form-group">
                        <label htmlFor="email_field">Enter Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            onChange = {(e) => setEmail(e.target.value)}
                        />
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