import './App.css';
import Home from './components/Home';
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/products/ProductDetail';
import ProductSearch from './components/products/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { useEffect, useState } from 'react';
import store from './store';
import { loadUser } from './actions/userActions';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import Confirmorder from './components/cart/Confirmorder';
import Payment from './components/cart/Payment';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Ordersuccess from './components/cart/Ordersuccess';
import UserOrders from './components/order/UserOrders';
import OrderDetail from './components/order/OrderDetail';
import { useSelector } from 'react-redux';

function App() {
  //we pass the key to where we need.for that  we create useState
  const[stripeApiKey, setStripeApiKey] = useState("");

  const { isAuthenticate } =useSelector(state=>state.authState);

    //payment stripe data
   const getStripeApiKey = () =>  async() => {

      //url for publish key we get this key once app open
      const { data } = await axios.get('/api/v1/stripeapi');

      //update setStripeApiKey with data(publishkey) in the name of stripeApi key in redux state
      setStripeApiKey(data.stripeApiKey);
    }

    //to make userdatas from db available to whole website once we logged in
  useEffect(()=>{
    store.dispatch(loadUser);
  },[])//loaduser only executes whenever component mounts


  useEffect(()=>{
    if(isAuthenticate){
        getStripeApiKey();//we should call this fn to get publish key
      }
  })
    
  

  return (
    <HelmetProvider>
    <Router>
    <div className="App">
        <Header/>

        <main className="app-content">
         <div className="container container-fluid">{/*to add white spaces at each end for correct alignment*/}
          <ToastContainer theme='dark'/>
          <Routes>
            {/*Home route */}
          <Route path='/' element={<Home/>}/>

           {/*Product routes */}
          <Route path='/product/:id' element={<ProductDetail/>}/>
          <Route path ='/search/:keyword' element={<ProductSearch/>} />

          {/*auth routes */}
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/myprofile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
          <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}/>
          <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>}/>
          <Route path='/password/forgot' element={<ForgotPassword/>}/>
          <Route path='/password/reset/:token' element={<ResetPassword/>}/>

          {/*cart routes*/}
          <Route path='/cart' element={<Cart/>}/>
          
          <Route path='/shipping' element={<ProtectedRoute><Shipping/></ProtectedRoute>}/>
          {/* if we directly give shipping url it should not open without login */}
          
          <Route path='/order/confirm' element={<ProtectedRoute><Confirmorder/></ProtectedRoute>}/>
          {/*
          reset route should be same as the email url link

          here <ProtectedRoute> </ProtectedRoute> - Parent element
          <Profile/> - children
          */}

          <Route path='/order/success' element={<ProtectedRoute><Ordersuccess/></ProtectedRoute>}/>

            {/*userOrders route */}
          <Route path='/orders' element={<ProtectedRoute><UserOrders/></ProtectedRoute>}/>
          <Route path='/order/:id' element={<ProtectedRoute><OrderDetail/></ProtectedRoute>}/>

            {/*payment route */}
          {stripeApiKey && <Route path='/payment' element={<ProtectedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements></ProtectedRoute>}/>}
            {/*
              install stripe for react and front end using command npm install @stripe/react-stripe-js @stripe/stripe-js
              Elements - get elements used in stripe payment
              loadingStripe - function of frontend stripe package used to pass keys to payment component
              stripeApikey - state variable of usestate contains publish key
               {stripeApiKey && - only key available we could pass the key
              */}


        


          </Routes>
        </div>
</main>

        <Footer/>
   
    </div>
    </Router>
     </HelmetProvider>

  );
}

export default App;
