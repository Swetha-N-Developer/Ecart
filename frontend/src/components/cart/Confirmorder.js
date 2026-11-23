import { Fragment } from "react/jsx-runtime";
import MetaData from '../layouts/MetaData'
import { validateShipping } from "./Shipping";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Checkoutsteps from "./Checkoutsteps";

export default function Confirmorder(){

    //get datas like shipping details,cartitems and user details from state
    const { shippingInfo, items:cartItems } = useSelector(state => state.cartState);
    const { user } = useSelector(state => state.authState);

    //Price calculation
    const itemsPrice = cartItems.reduce((acc, item)=>(acc + item.price * item.quantity),0)
    //cartItems- array from state here we take it as item so we call item.price

    const  shippingPrice = itemsPrice > 200 ? 0 : 25;
    //if shippingPrice>200 then add 25$ as shipping price
    
    /*
        const taxPrice = Number(itemsPrice * 0.05).toFixed(2);
        here above value used .tofixed so we cant calculate total price
    */

    let taxPrice = Number(itemsPrice * 0.05);
    //add 5% of itemPrice  as taxamount.here we change it to let scope and .tofixed is deleted

    const totalPrice = Number(itemsPrice + shippingPrice + taxPrice).toFixed(2);
    //Number().tofixed - round off the value to 2 decimal places

    taxPrice = Number(itemsPrice * 0.05).toFixed(2);
    //reassign the values here we should not use let keyword

    const navigate = useNavigate();

    //store all order details in session storage when we click proceed to payment
    const processPayment = () =>{
        const data ={
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }
        sessionStorage.setItem('orderInfo', JSON.stringify(data));
        /*
            sessionStorage - javascript function
            orderInfo - we give the name of orderdetails as orderInfo
            JSON.stringify(data) - convert JSON data to JSON string and store it in sessionStorage
            it is temperory data it will be deleted once the browser is closed
        */
        navigate('/payment')
    }

     // 1. Background image effect
        useEffect(() => {
    
            document.body.style.backgroundImage = "url('/images/shopping_bg.png')";
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


    //confirm order page should not open if the shipping details are not filled
    useEffect(()=>{
        validateShipping(shippingInfo, navigate);
    })

    return(
        
        <Fragment>
            <Checkoutsteps shipping confirmOrder/>
            <MetaData title={'Confirm Order'}/>

            <div className="row d-flex justify-content-between">

                <div className="col-12 col-lg-8 mt-5 order-confirm">
                    <h4 className="mb-3">Shipping Info</h4>
                    <p><b>Name:</b> { user.name }</p>
                    <p><b>Phone:</b> { shippingInfo.phoneNo }</p>
                    <p className="mb-4"><b>Address:</b> { shippingInfo.address }, { shippingInfo.city }, { shippingInfo.postalCode },  { shippingInfo.state }, { shippingInfo.country }</p>
                    
                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>

                    {/*cartItem is  an array so we use map function*/}
                    {cartItems.map(item => (
                        <Fragment>
                            <div className="cart-item my-1">
                                <div className="row">
                                <div className="col-4 col-lg-2">
                                    <img src={item.image} alt={ item.name } height="45" width="65"/>
                                </div>

                                <div className="col-5 col-lg-6">
                                    <Link to={`/product/${item.product}`}>{ item.name }</Link>
                                    {/*here item.product is an id*/}
                                </div>


                                <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                    <p>{ item.quantity } x {item.price} = <b>{item.quantity * item.price}</b></p>
                                </div>

                                </div>
                            </div>
                             <hr />
                        </Fragment>
                   

                    )
                    )}
                </div>
                
                <div className="col-12 col-lg-3 my-4">
                        <div id="order_summary">
                            <h4>Order Summary</h4>
                            <hr />
                            <p>Subtotal:  <span className="order-summary-values">${itemsPrice}</span></p>
                            <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                            <p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>

                            <hr />

                            <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

                            <hr />
                            <button  onClick ={processPayment} id="checkout_btn" className="btn btn-primary btn-block">Proceed to Payment</button>
                        </div>
                    </div>
                
                </div>
        </Fragment>
    )
}