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

    //create state to get selected  avatar
    const [avatar,setAvatar] =useState("");

    //create state to prerview selected avatar
    const [avatarPreview,setAvatarPreview] = useState("/images/default_avatar.jpg");

    //errors state for frontend validation
    const[ errors, setErrors ] = useState({});
   
    //create dispatch hook to send data to register action
    const dispatch = useDispatch();

    const navigate = useNavigate();

    //get loading variable from state in browser by object  deconstruction
    const { loading,error,isAuthenticated } = useSelector(state => state.authState)//authstate object contains loading value

    /*
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
    /*
            }
            else{
                setUserData({...userData, [e.target.name]:e.target.value})
            }
    }
*/

    //frontend validation for name,email and password
    const validateField = (name, value) => {
    let error = "";//user defined name not state

    // Name validation
    if (name === "name") {
        if (value.trim() === "") {
            error = "Name is required";
        }
        else if(value.trim().length < 3){
            error =  "Name must contain atleast 3 characters"
        }
    }

    // Email validation
    if (name === "email") {
        if (value.trim() === "") {
            error = "Email is required";
        }
        else if (value.trim().length < 5) {
            error = "Email must contain at least 5 characters";
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            error = "Please enter a valid email address";
        }
    }

    // Password validation
    if (name === "password") {
        if (value === "") {
            error = "Password is required";
        }
        else if (value.length !== 8) {
            error = "Password should not exceed 8 characters";
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

    return error;
};

//frontend validation for image(avatar)
const validateAvatar = (file) => {//here avatar input type is file
    let error = "";

    if (file) {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            error = "Only JPG, PNG and WEBP images are allowed";
        }
        else if (file.size > 2 * 1024 * 1024) {
            error = "Image size must be less than 2 MB";
        }
    }

    return error;
};


const onChange = (e) => {

    // If the user selects an avatar
    if (e.target.name === "avatar") {

        const file = e.target.files[0];

        // If the user didn't select a file
        if (!file) {
            return;
        }

        // Validate avatar
        const avatarError = validateAvatar(file);

        setErrors(prevErrors => ({
            ...prevErrors,
            avatar: avatarError
        }));

        // If the avatar is invalid, stop here
        if (avatarError) {
            return;
        }

        // Store the selected avatar
        setAvatar(file);

        // Preview the selected avatar
        const reader = new FileReader();

        reader.onload = () => {
            setAvatarPreview(reader.result);
        };

        reader.readAsDataURL(file);
    }

    // If the user types in name, email or password
    else {

        const { name, value } = e.target;

        // Update userData state
        setUserData({
            ...userData,
            [name]: value
        });

        // Validate the field while typing
        const error = validateField(name, value);

        // Update errors state
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    }
};

//after submission with front end validation
const submitHandler = (e) => {
    e.preventDefault();

    // Validate all text fields
    const nameError = validateField("name", userData.name);
    const emailError = validateField("email", userData.email);
    const passwordError = validateField("password", userData.password);

    // Validate avatar
    const avatarError = validateAvatar(avatar);

    // Store all errors
    const newErrors = {
        name: nameError,
        email: emailError,
        password: passwordError,
        avatar: avatarError
    };

    setErrors(newErrors);

    // Check whether any error exists
    if (Object.values(newErrors).some(error => error !== "")) {
        return;
    }
    /*
    Object.values(newErrors) gets all the error messages.
    .some() checks whether at least one error exists.
    error !== "" checks whether an error message is present.
    */

    // If there are no errors, submit the form
    const formData = new FormData();

    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    // Avatar is optional
    if (avatar) {
        formData.append("avatar", avatar);
    }

    dispatch(register(formData));
};

/*
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

*/
// 1. Background image effect
    useEffect(() => {

        document.body.style.backgroundImage = "url('/images/registerBG.png')";
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
               <div className="row wrapper1">
                    <div className="col-10 col-lg-5">
                    <form onSubmit ={submitHandler} className="shadow-lg" encType='multipart/form-data'noValidate>
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

                            {errors.name && (
                                <p className="error-message">* {errors.name}</p>
                            )}
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
                        {errors.email && (
                            <p className="error-message">* {errors.email}</p>
                        )}
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
                        {errors.password && (
                             <p className="error-message">* {errors.password}</p>
                        )}
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
                    
                    {errors.avatar && (
    <p className="error-message">* {errors.avatar}</p>
)}
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