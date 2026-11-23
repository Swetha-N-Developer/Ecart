import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { clearAuthError, updateProfile } from "../../actions/userActions.js"
import { toast } from "react-toastify";
import { clearUpdateProfile } from "../../slices/authSlice.js";

export default function UpdateProfile(){
    const { error, user, isUpdated} = useSelector(state => state.authState);

    //to update fields set state for each input fileds
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
    const [errors,setErrors] = useState({});
    
    //to send actions to reducers
    const dispatch = useDispatch();

    //to update image from myprofile page
    const onChangeAvatar = (e) => {
            const file = e.target.files[0];

            if (!file) {
                return;
            }

            // Validate the selected image
            const avatarError = validateAvatar(file);

            // Store the avatar error
            setErrors(prevErrors => ({
                ...prevErrors,
                avatar: avatarError
    }));

    // If invalid, stop
    if (avatarError) {
        e.target.value = "";
        return;
    }

    // Store the valid avatar file
    setAvatar(file);

    // Create image preview
    const reader = new FileReader();

    reader.onload = () => {
        if (reader.readyState === 2) {
            setAvatarPreview(reader.result);
        }
    };

    reader.readAsDataURL(file);
};

     //frontend validation function
        const validateField = (name, value) => {
    let error = "";

    // Name validation
    if (name === "name") {
        if (value.trim() === "") {
            error = "Name is required";
        }
        else if (value.trim().length < 3) {
            error = "Name must contain at least 3 characters";
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

    setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error
    }));

    return error;
};

    //frontend validation for image(avatar)
const validateAvatar = (file) => {
    let error = "";

    // Avatar is optional
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
    
   const submitHandler = (e) => {
    e.preventDefault();

    // Validate name
    const nameError = validateField("name", name);

    // Validate email
    const emailError = validateField("email", email);

    // Validate avatar
    const avatarError = validateAvatar(avatar);

    // Store all errors together
    const newErrors = {
        name: nameError,
        email: emailError,
        avatar: avatarError
    };

    setErrors(newErrors);

    // Stop if any error exists
    if (nameError || emailError || avatarError) {
        return;
    }

    // If all validations are successful
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);

    // Append avatar only if a new one was selected
    if (avatar) {
        formData.append("avatar", avatar);
    }

    dispatch(updateProfile(formData));
};


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


        
    useEffect(() =>{
        //get form input values into input field of editPROFILE Page
        if(user){
            setName(user.name);
            setEmail(user.email);
            if(user.avatar){//if user has own profile picture
                setAvatarPreview(user.avatar)
            }

            //if profile updated then show updated msg in toastify
            if(isUpdated)
            {
                toast('Profile Updated  Successfully',{
                    type : 'success',//show msg in green color
                    position :"bottom-center" ,// postion of toastify msg
                    onOpen: ()=> dispatch(clearUpdateProfile())
                })
                return;
            }

            //show error msg
            if(error){
                toast(error,{
                position : "bottom-center",
                type : 'error',//to show error toast
                onOpen :()=>{ dispatch(clearAuthError())}
                //clear previous email id and password after login in login page we supposed to create reducers in authslice
                })
                return //return doesnot execute any other functions
            }
         }

        
    },[error, isUpdated, user, dispatch]) 
    
    return(
           <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit = {submitHandler} className="shadow-lg" encType='multipart/form-data' noValidate>
                        <h1 className="mt-2 mb-5">Update Profile</h1>

                        <div className="form-group">
                            <label htmlFor="name_field">Name</label>
                            <input 
								type="text" 
								id="name_field" 
								className="form-control"
                                name='name'
                                value={name}
                                onChange={(e) =>{ 
                                    setName(e.target.value);
                                    validateField("name",e.target.value)//pass arguments get from input fileld to validate Field function
                                    }//fn in setEmail
                                }
                            />
                            {errors.name && (
                                <p className="error-message">* {errors.name}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                 onChange={(e) =>{ 
                                    setEmail(e.target.value);
                                    validateField("email",e.target.value)//pass arguments get from input fileld to validate Field function
                                    }//fn in setEmail
                                }
                            />
                             {errors.email && (
                            <p className="error-message">* {errors.email}</p>
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
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        onChange = {onChangeAvatar}
                                        accept="image/jpeg,image/png,image/webp"
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
                    <button type="submit" className="btn update-btn btn-block mt-4 mb-3" >Update</button>

                    
                    </form>

                  
                </div>
                 <span><img src='/images/edit.png' alt="updateprofile"/></span>
            </div>
            
    )
}