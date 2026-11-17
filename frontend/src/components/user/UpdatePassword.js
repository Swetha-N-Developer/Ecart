import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, updatePassword as updatePasswordAction} from '../../actions/userActions'
import { toast } from "react-toastify";

export default function UpdatePassword(){

    //set state for i/p fields
    const [newPassword,setnewPassword] = useState("");
    const [oldPassword,setOldPassword] = useState("");

    const dispatch = useDispatch();

    const { isUpdated,error } = useSelector(state => state.authState)

    const submitHandler =(e)=>{
        e.preventDefault();
        const formData = new FormData();//formData-javascript obj
        formData.append('oldPassword',oldPassword);
        formData.append('newPassword',newPassword);
        dispatch(updatePasswordAction(formData));
    }

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
                                onChange = {e =>setOldPassword(e.target.value)}
                                /* onChange- while typing it gets value from inputField and set it as oldpassword*/
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={newPassword}
                                onChange = {e =>setnewPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3">Update Password</button>
                    </form>
                </div>
            </div>
    )

}
