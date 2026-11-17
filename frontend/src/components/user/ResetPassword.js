import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { clearAuthError, resetPassword } from "../../actions/userActions";
import { toast } from "react-toastify";

export default function ResetPassword(){
    const [password, setpassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    //useParams is used to get token value from url.token - same name that we used in route

    const { isAuthenticated, error } = useSelector(state => state.authState);

    const submitHandler = (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('password',password);//'password'-key of db.password-state value
        formData.append('confirmpassword',confirmPassword);
        dispatch(resetPassword(formData, token)); //send both form data and token to action
     }

     //after change the password it should be redirected to home page
     useEffect(() => {
        if(isAuthenticated) 
        {
            //success msg 
             toast('Password Reset Successfully!',{
                 type: 'success',
                 position: "bottom-center"
                })
                navigate('/');//redirect to home page
              return;
        }

        if(error)
            {
            toast(error, {
                position: "bottom-center",
                type: 'error',//to show error toast
                onOpen: () => { dispatch(clearAuthError) }
                //clear previous email id and password after login in login page we supposed to create reducers in authslice
            })
            return //return doesnot execute any other functions
                        }
    },[isAuthenticated, error, dispatch, navigate])

    return(
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit ={submitHandler} className="shadow-lg">
                    <h1 className="mb-3">New Password</h1>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange = {(e) => {setpassword(e.target.value)}}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                             value={confirmPassword}
                            onChange = {(e) => {setConfirmPassword(e.target.value)}}
                        />
                    </div>

                    <button
                        id="new_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Set Password
                    </button>

                </form>
            </div>
        </div>
    )
}