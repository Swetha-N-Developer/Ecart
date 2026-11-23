import { useEffect } from "react";
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";


export default function Profile()
{
    //get user field from authState in redux
    const { user } = useSelector(state=> state.authState);

    // 1. Background image effect
        useEffect(() => {
    
            document.body.style.backgroundImage = "url('/images/homeBG.png')";
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
    

    return(
          <div className="row justify-content-around mt-5 user-info">
            <div className="col-12 col-md-3">
                <figure className='avatar avatar-profile'>
                    <img className="rounded-circle img-fluid" src={user.avatar ?? '/images/default_avatar.jpg'} alt='' />
                </figure>
                <Link to="/myprofile/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                    Edit Profile
                </Link>
            </div>
     
            <div className="col-12 col-md-5">
                 <h4>Full Name</h4>
                 <p>{user.name}</p>
     
                 <h4>Email Address</h4>
                 <p>{user.email}</p>

                 <h4>Joined</h4>
                 <p>{String(user.createdAt).substring(0,10)}</p>
                {/*
                    String() - convert date into string
                    subString(0,10)- it extracts 0th place to 10th place of date string and displays
                 */}

                 <Link to="/orders" className="btn btn-danger btn-block mt-5">
                    My Orders
                </Link>

                <Link to="/myprofile/update/password" className="btn btn-primary btn-block mt-3">
                    Change Password
                </Link>
            </div>
        </div>
    )
}