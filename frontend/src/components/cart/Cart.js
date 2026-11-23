import { Fragment } from "react/jsx-runtime";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'
import { increaseCartItemQty, decreaseCartItemQty, removeItemFromCart } from "../../slices/cartSlice";
import { useEffect } from "react";


export default function Cart(){
    const { items } = useSelector(state=>state.cartState);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const increaseQty = (item) => {
        const count = item.quantity;
        if(item.stock === 0 || count >= item.stock) return;
        dispatch(increaseCartItemQty(item.product))//send productid to action
    }

    const decreaseQty = (item) =>{
        const count = item.quantity;
        if(count === 1) return;
        dispatch(decreaseCartItemQty(item.product));//send productid to action
    }

    //move to shipping page when we checkout in cart
    const checkoutHandler = () =>{
        navigate('/login?redirect=shipping')
        /*
            redirect - if the user isnot loggedin it opens login page 
            after suceesfull login it usually goes to homepage 
            instead of goes to homepage redirect helps to specified page(shipping page) with value 
        */
    }

    // 1. Background image effect
        useEffect(() => {
    
            document.body.style.backgroundImage = " linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)),url('/images/cart.png')";
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
         <Fragment>
            {/* ternary operator - lenght of cart =0 then it displays cart is empty or it displays cart items */}
            {items.length === 0 ?
                    <div class="container">
                        <div class="box">
                            <img src="\images\empty.gif" alt="emptycart"/>
                            <h2> <b> Your Cart is Empty</b> </h2>
                        </div>
                    </div>
          
           
            :
            <Fragment>

                <h2 className="mt-5">Your Cart: <b>{ items.length } items</b></h2>
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-lg-8">

                        {/*map function - items= array name, item = each array item */}
                        {items.map(item =>(

                        <Fragment>
                            <hr />
                            <div className="cart-item">
                                <div className="row">
                                    <div className="col-4 col-lg-3">
                                        <img src={ item.image } alt={ item.name } height="90" width="115"/>
                                    </div>

                                    <div className="col-5 col-lg-3 text-dark">
                                        <Link to={`/product/${item.product}`}>{ item.name }</Link>
                                        {/* route = /product/:id here in localStorage id is saved as product key */}
                                    </div>


                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                        <p id="card_item_price">${ item.price }</p>
                                    </div>

                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                        <div className="stockCounter d-inline">
                                            <span className="btn btn-danger minus" onClick ={() => decreaseQty(item)}>-</span>

                                            <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />

                                            <span  className="btn btn-primary plus" onClick ={() => increaseQty(item)}>+</span>
                                        </div>
                                    </div>

                                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                        <i id="delete_cart_item" onClick={()=>dispatch(removeItemFromCart(item.product))} className="fa fa-trash btn btn-danger"></i>
                                    </div>

                                </div>
                            </div>
                        </Fragment>
                        )
                         )}
                        <hr />
                    </div>


                    <div className="col-12 col-lg-3 my-4">
                        <div id="order_summary">
                            <h4>Order Summary</h4>
                            <hr />
                            <p>Subtotal:  <span className="order-summary-values" >{items.reduce((acc,item)=>(acc + item.quantity),0)}(Units)</span></p>
                            {/*
                                subtotal - toal items in cart  if i have first item with quantity 2 and second itrm with quantity 1 then subtotal is 3 units
                                items.reduce - array reduce function it converts array value into single value by performing operations
                                acc - accumulator. its initial value is 1.it acts like a loop and gives result as summative value of array
                            */}

                            <p>Est. total: <span className="order-summary-values">${items.reduce((acc,item)=>(acc + item.quantity * item.price),0).toFixed(2)}</span></p>
                            {/*total = (price * quantity)of each item */}
                            <hr />
                            <button id="checkout_btn" 
                                    onClick = { checkoutHandler }
                                    className="btn btn-primary btn-block">Check out</button>
                        </div>
                    </div>
                </div>

             </Fragment>

            }
        
        </Fragment>

    )
}