import React from 'react';
import Search  from './Search';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image} from 'react-bootstrap'
import { logout } from '../../actions/userActions';


export default function Header(){

  //get isAutenticated and user object from redux state to make login visible only if isAuthenticated false
  const { isAuthenticated,user} = useSelector(state=> state.authState);

  const { items:cartItems } = useSelector(state=>state.cartState);
  //here items is an array.its a common name so we stored it as cartItems.
  //logout
  const dispatch = useDispatch();

  const logoutHandler=()=>{
    dispatch(logout);//call logout action in userActions
  }

  //profile
  const navigate = useNavigate();


    return(
    
    <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <img width="100px" src="/images/logo11.png" alt="EcartLogo"/>
          
        </div>

        <span className="ml-3">
          <Link to="/register" className="btn" id="login_btn">
                signup
            </Link>
            </span>
      </div>

      <div>
      
      </div>

     <div className="col-12 col-md-6 mt-2 mt-md-0 d-flex justify-content-center">

      <Link to ='/'>
        <img width="40px" src="/images/home2.png" alt="EcartLogo"/>
      
      </Link>

        <div className="ml-1 flex-grow-1">

        <Search/>   
        </div>   
      </div>
 {/*}
      <div className="col-12 col-md-3 mt-4 mt-md-0 d-flex text-center">


      {/*ternary operator to show "logged in" if isAuthenticated :true else show log in button*/}
       {/* { isAuthenticated ? 
        (
          <Dropdown  className = 'd-inline'>

            <Dropdown.Toggle variant = 'default text-white pr-5' id='dropdown-basic'>
              <figure className="avatar avatar-nav">
                <Image width = "40px"  height="40px" src={user.avatar ?? './images/profile2.jpg'} roundedCircle/>
                {/*user - already we extract user obj from authState in redux
                   avatar - name in db. but avatar is optional
                   x??Y - null coaelsing operator if x exists it print x else it prints Y
               */}
            {/*} <span>{user.name}</span>
              </figure>
            </Dropdown.Toggle>

              
          
            <Dropdown.Menu>
              <Dropdown.Item className = 'text-danger'>Logout</Dropdown.Item>
            </Dropdown.Menu>
            
            </Dropdown>

         
        ) 
        :
        <Link to="/login" className="btn" id="login_btn">Login</Link>
        }

        <span id="cart" className="ml-3">Cart</span>
        <span className="ml-1" id="cart_count">2</span>
        
        
      </div>
    */}  

      
<div className="col-12 col-md-3 mt-4 mt-md-0" >

    <div className="d-flex align-items-center justify-content-end flex-nowrap">

        {isAuthenticated ? (
           
<Dropdown className="d-inline-block  ml-0 px-4">
    <Dropdown.Toggle
        variant="default"
        id="dropdown-basic"
        className="text-white"
    >
        <Image
            width={40}
            height={40}
            src={user.avatar ?? '/images/default_avatar.jpg'}
            roundedCircle
        />
        <span className="profile-name">{user.name}</span>
    </Dropdown.Toggle>

    <Dropdown.Menu>
        <Dropdown.Item className="text-dark" onClick={()=>{navigate('/myprofile')}} >
            Profile
        </Dropdown.Item>
        <Dropdown.Item className="text-dark" onClick={()=>{navigate('/orders')}} >
            Orders
        </Dropdown.Item>
        <Dropdown.Item className="text-danger" onClick={logoutHandler} >
            Logout
        </Dropdown.Item>
    </Dropdown.Menu>
</Dropdown>

        ) : (
            <Link to="/login" className="btn" id="login_btn">
                Login
            </Link>
        )}

      <Link to='/cart' > <span id="cart" className="ml-3 flex-shrink-0">Cart</span></Link>
        <span className="ml-1 flex-shrink-0" id="cart_count">{ cartItems.length }</span>
        {/* cartItems is  an array so we get the length by cartItems.length */}
    </div>
</div>

      </nav>
   )
}
//function name should be in capital letter
//return keyword returns jsx means javascript and html
