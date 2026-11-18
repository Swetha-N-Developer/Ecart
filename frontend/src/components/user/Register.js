import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, register } from "../../actions/userActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"

export default function Register(){
    //create state to get input field values at run time
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: ""
    });

    //crerate state to get selected  avatar
    const [avatar,setAvatar] =useState("");

    //create state to prerview selected avatar
    const [avatarPreview,setAvatarPreview] = useState("/images/default_avatar.jpg")
   
    //create dispatch hook to send data to register action
    const dispatch = useDispatch();

    const navigate = useNavigate();

    //get loading variable from state in browser by object  deconstruction
    const { loading,error,isAuthenticated } = useSelector(state => state.authState)//authstate object contains loading value

    //define onChange fn to get all input values
    const onChange = (e) =>{
        //define function to get a image and preview that same image we selected
       
            if(e.target.name === 'avatar')
            {
                const reader = new FileReader();
                //reader is an object to read selected file
    
                reader.onload = () =>{
                    if(reader.readyState === 2)//2 means the file loading is done
                    {
                        setAvatarPreview(reader.result);
                        //result contain seleted image's url
                        setAvatar(e.target.files[0])
                    }
    
                }
    
                reader.readAsDataURL(e.target.files[0])
                /*
                readAsDataURL - convert the selected file into url with binary codes encrypted with bcrypt
                e.target.files[0] - selected file will be one file so it should be in zeroth array value
                */
    
            }
            else{
                setUserData({...userData, [e.target.name]:e.target.value})
            }
    }

    //after submission
    const submitHandler = (e) =>{
        e.preventDefault();

        console.log("User data:", userData);
    console.log("Avatar:", avatar);

        //get input datas from register component
        const formData = new FormData();//formData is an object
        formData.append('name',userData.name);//here name is akey and userData.name is avalue
        formData.append('email',userData.email);
        formData.append('password',userData.password);
        formData.append('avatar',avatar);//avatar is  not in userData its just in avatar state
    
        dispatch(register(formData))//register is a function in userActions.js
    }

    //show errors in toast
    useEffect(() => {
        if(isAuthenticated)
        {
            navigate('/');
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
    },[error, isAuthenticated, dispatch, navigate]) 


    
    return(
               <div className="row wrapper">
                    <div className="col-10 col-lg-5">
                    <form onSubmit ={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                        <h1 className="mb-3">Register</h1>

                    <div className="form-group">
                        <label htmlFor="email_field">Name</label>
                        <input 
                            name='name'
                            onChange = {onChange}
                            type="name" 
                            id="name_field" 
                            className="form-control" 
                            value={userData.name} />
                    </div>

                        <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                             name='email'
                            onChange = {onChange}
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={userData.email} 
                        />
                        </div>
            
                        <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                             name='password'
                            onChange = {onChange}
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={userData.password} 
                        />
                        </div>

                        <div className='form-group'>
                        <label htmlFor='avatar_upload'>Avatar</label>
                        <div className='d-flex align-items-center'>
                            <div>
                                <figure className='avatar mr-3 item-rtl'>
                                    <img
                                        src={avatarPreview}
                                        className='rounded-circle'
                                        alt='Avatar'
                                    />
                                </figure>
                            </div>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='avatar'
                                    onChange = {onChange}
                                    className='custom-file-input'
                                    id='customFile'
                                />
                                <label className='custom-file-label' htmlFor='customFile'>
                                    Choose Avatar
                                </label>
                            </div>
                        </div>
                    </div>
            
                        <button
                        id="register_button"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled = { loading } //disable register button wheh loading
                        >
                        REGISTER
                        </button>
                    </form>
                    </div>
                </div>
    )
}