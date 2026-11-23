import { useElements, useStripe } from '@stripe/react-stripe-js';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { validateShipping } from './Shipping';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { orderCompleted } from '../../slices/cartSlice';
import { createOrder } from '../../actions/orderAction';
import { clearOrderError } from '../../slices/orderSlice';


export default function Payment(){
    const stripe = useStripe();
    //useStripe hook from react stripe package.It contains funtions for frontend

    const elements = useElements();
    //useElements - to access elements for payment like card,number

    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))
    /*
        once proceed to payment button is clicked in confirm order page, orderInfo will be saved in sessionStorage of application tab on dev tools
        we get that order info from session storage.it is usually in string
        JSON.parse converts this string to JSOn data ansd store it in orderInfo variable
    */

    const { user } =useSelector(state=>state.authState)
    //get user details from redux state

    const { items:cartItems, shippingInfo } = useSelector(state => state.cartState)
    //get cart item details from cartState

    const { error:orderError } = useSelector(state => state.orderState)
   
    const paymentData = {
        
    amount : Math.round(orderInfo.totalPrice *100),
    //Math.round - round off the value.*100 - convert it into USD.because in backend currency type is USD
    shipping:{
        name : user.name,
        address : {
            city : shippingInfo.city,
            postal_code : shippingInfo.postalCode,
            country : shippingInfo.country,
            state : shippingInfo.state,
            line1 : shippingInfo.address//we should give address as line1 then only react will take it as an address
        },
        phone : shippingInfo.phoneNo 
        
    }
    }

    //order placement details
    const order = {
        orderItems : cartItems,
         shippingInfo: {
        address: shippingInfo.address,
        country: shippingInfo.country,
        city: shippingInfo.city,
        phoneNumber: shippingInfo.phoneNo,
        postalCode: shippingInfo.postalCode
    }
    }

    if(orderInfo){
        order.itemPrice = orderInfo.itemsPrice
        order.taxPrice = orderInfo.taxPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.totalPrice = orderInfo.totalPrice
    }

   

    const submitHandler= async(e) =>{
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true;
        //pay button is disabled untill payment transaction is completed with btn id

        try{
            //because of async fn we are using try and catch block

           const { data } = await axios.post('/api/v1/payment/process',paymentData);
           //call payment backend api with payment info

            const clientSecret = data.client_secret;
            //from backend result we are getting client secret

           //payment process
            const result = await stripe.confirmCardPayment(clientSecret,{
                payment_method : {
                    card : elements.getElement(CardNumberElement),//get all card details using element
                    billing_details : {//get user details
                        name : user.name,
                        email : user.email
                    }
                }
            })

            //error from above fn
            if(result.error)
            {
                toast(result.error.message,{
                    type : 'error',
                    position : 'bottom-center'
                })
            document.querySelector('#pay_btn').disabled = false;//enable pay btn
            }
            else{//sucess msg
                if((await result).paymentIntent.status === 'succeeded'){
                    toast('payment Success!',{
                        type : 'success',
                        position : 'bottom-center'
                    })

                    //get id and status from paymentIntent store it in backend
                    order.paymentInfo={
                        id: result.paymentIntent.id,
                        status : result.paymentIntent.status
                    }
                   
                    
                   await  dispatch(createOrder(order));
                    dispatch(orderCompleted());

                    navigate('/order/success');//move to next page
                    //after payment success  we should empty cartitems shipping info and order info using reducer in cartslice
                    
                    

                   
                }
            
            else{
               toast('payment Try again!',{//warning msg
                        type : 'warning',
                        position : 'bottom-center'
                    }) 
            }
        }
    }
       catch(error) {

    console.log(error);

    toast(error.response?.data?.message || error.message, {
        type: 'error',
        position: 'bottom-center'
    });

    document.querySelector('#pay_btn').disabled = false;
}
    }


    // 1. Background image effect
        useEffect(() => {
    
            document.body.style.backgroundImage = "url('/images/shoppingBg.png')";
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


     useEffect(() => {
        validateShipping(shippingInfo, navigate)//we shoulld fill shipping details then only can come to payment Page
        if(orderError)
        {
            toast(orderError, {
                position: "bottom-center",
                type: 'error',//to show error toast
                onOpen: () => { dispatch(clearOrderError()) }
                //clear previous email id and password after login in login page we supposed to create reducers in authslice
            })
            return //return doesnot execute any other functions
        }
   
    },[navigate,shippingInfo,dispatch,orderError])
             
                    


    return (
        <div className="row wrapper">
		<div className="col-10 col-lg-5">
            <form onSubmit ={ submitHandler} className="shadow-lg">
                <h1 className="mb-4">Card Info</h1>
                <div className="form-group">
                  <label htmlFor="card_num_field">Card Number</label>
                  <CardNumberElement
                    type="text"
                    id="card_num_field"
                    className="form-control"
                    value=""
                  />
                </div>
				
				<div className="form-group">
                  <label htmlFor="card_exp_field">Card Expiry</label>
                  <CardExpiryElement
                    type="text"
                    id="card_exp_field"
                    className="form-control"
                    value=""
                  />
                </div>
				
				<div className="form-group">
                  <label htmlFor="card_cvc_field">Card CVC</label>
                  <CardCvcElement
                    type="text"
                    id="card_cvc_field"
                    className="form-control"
                    value=""
                  />
                </div>
      
            
                <button
                  id="pay_btn"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  Pay { `$${orderInfo && orderInfo.totalPrice}`}

               {/* 
               Pay -This is simply the text displayed on the button.
                { } - In JSX, curly braces allow us to write JavaScript expressions inside HTML-like code.
                ${...} - inserts a JavaScript expression.
                orderInfo && orderInfo.totalPrice - This is the logical AND (&&) operator.
                    It checks whether orderInfo exists (is truthy).
                    - If orderInfo exists, it returns orderInfo.totalPrice.
                    - If orderInfo is null or undefined, it returns that falsy value instead of accessing totalPrice.
                */ } 


                </button>
    
              </form>
			  </div>
        </div>
    )
}