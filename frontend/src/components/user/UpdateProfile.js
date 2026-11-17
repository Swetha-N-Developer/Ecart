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
    
    //to send actions to reducers
    const dispatch = useDispatch();

    //to update image from myprofile page
    const onChangeAvatar = (e) =>{
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

    }
    
    const submitHandler =(e) =>{
          e.preventDefault();
                //get input datas from register component
                const formData = new FormData();//formData is an object
                formData.append('name',name);//here name is akey and name is avlue from useState
                formData.append('email',email);
                formData.append('avatar',avatar);
            
                dispatch(updateProfile(formData))//updateProfile is a function in userActions.js
            }
        
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
                onOpen :()=>{ dispatch(clearAuthError)}
                //clear previous email id and password after login in login page we supposed to create reducers in authslice
                })
                return //return doesnot execute any other functions
            }
         }

        
    },[error, isUpdated, user, dispatch]) 
    
    return(
           <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit = {submitHandler} className="shadow-lg" encType='multipart/form-data'>
                        <h1 className="mt-2 mb-5">Update Profile</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input 
								type="name" 
								id="name_field" 
								className="form-control"
                                name='name'
                                value={name}
                                onChange = {e=>setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                onChange = {e=>setEmail(e.target.value)}
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
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                </label>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" >Update</button>
                    </form>
                </div>
            </div>
    )
}