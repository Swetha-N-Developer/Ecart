import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, updatePassword as updatePasswordAction} from '../../actions/userActions'
import { toast } from "react-toastify";

export default function UpdatePassword(){

    //set state for i/p fields
    const [newPassword,setnewPassword] = useState("");
    const [oldPassword,setOldPassword] = useState("");
    const[errors,setErrors] =useState({});

    const dispatch = useDispatch();

    const { isUpdated,error } = useSelector(state => state.authState)


         //frontend validation for name,email and password
    const validateField = (name, value) => {
    let error = "";//user defined name not state

    // Password validation
    if (name === "oldPassword") {
        if (value === "") {
            error = "Password is required";
        }
    }

    if (name === "newPassword") {
        if (value === "") {
            error = "Password is required";
        }else if (value.length < 4) {
            error = "Password must contain atleast 4 characters";
        }
        else if (value.length > 8) {
            error = "Password must not exceed 8 characters";
        }
        else if (!/[A-Z]/.test(value)) {
            error = "Password must contain at least one uppercase letter";
        }
        else if (!/[0-9]/.test(value)) {
            error = "Password must contain at least one number";
        }
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            error = "Password must contain at least one special character";
        }
    }

     //update error state with values
    setErrors(prevErrors => ({
        ...prevErrors,//if i move from email to pwd field it also preserves the email error
        [name]: error//password : pwd error.this is called computational property
    }));

    return error;//pass the errorvalues where validateField function calls
};


    const submitHandler =(e)=>{
        e.preventDefault();

        //call validateField Function for frontend validation
        const oldPasswordError = validateField("oldPassword", oldPassword);
        const newPasswordError = validateField("newPassword", newPassword);

        if (oldPasswordError|| newPasswordError) {
          return;//if any one of error exists it will stop the next code execution
          }


        const formData = new FormData();//formData-javascript obj
        formData.append('oldPassword',oldPassword);
        formData.append('newPassword',newPassword);
        dispatch(updatePasswordAction(formData));
    }




// 1. Background image effect
    useEffect(() => {

        document.body.style.backgroundImage = "url('/images/editprofileBG.png')";
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



    useEffect(()=>{
        //success msg
                    if(isUpdated)
                    {
                        toast('Password Updated  Successfully',{
                            type : 'success',//show msg in green color
                            position :"bottom-center" // postion of toastify msg
                        })

                        //clear input fields after updated password
                        setOldPassword("");
                        setnewPassword("");
                        return;
                    }
        //error msg
        //show error msg
                    if(error){
                        toast(error,{
                        position : "bottom-center",
                        type : 'error',//to show error toast
                        onOpen :()=>{ dispatch(clearAuthError)}
                        //clear previous email id and password after login in login page we supposed to create reducers in authslice
                        })
                        return //return doesnot execute any other functions
                    }
    },[isUpdated,error,dispatch])




    return(
        		<div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit = {submitHandler} className="shadow-lg">
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label htmlFor="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                value={oldPassword}//set typed data as value
                                 
                            onChange={(e) => {
                                setOldPassword(e.target.value);
                                validateField("oldPassword", e.target.value)
                            }
                        }
                                /* onChange- while typing it gets value from inputField and set it as oldpassword*/
                            />
                             {errors.oldPassword && (
                  <p className="error-message">
                      *{errors.oldPassword}
                  </p>
              )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => {
                                setnewPassword(e.target.value);
                                validateField("newPassword", e.target.value)
                            }
                        }
                            />
                             {errors.newPassword && (
                  <p className="error-message">
                      *{errors.newPassword}
                  </p>
              )}
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3">Update Password</button>
                    </form>
                </div>
                <span><img src='/images/change.gif' alt="change" width ="400px" height="400px"/></span>
            </div>
    )

}
