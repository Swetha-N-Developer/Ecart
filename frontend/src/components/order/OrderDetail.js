import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { orderDetail as orderDetailAction } from "../../actions/orderAction";
import Loader  from '../layouts/Loader';
import { Link } from "react-router-dom";

export default function OrderDetail(){
    const { orderDetail, loading } = useSelector(state => state.orderState);
    const { shippingInfo ={}, user={}, orderStatus="Processing", orderItems=[],totalPrice=0, paymentInfo={} } = orderDetail;
    //to show different colors of paid and unpaid
    const isPaid = paymentInfo && paymentInfo.status === "succeeded" ? true : false;
    const dispatch = useDispatch();
    //get id from url.id name should be same as route id name
    const {id} = useParams();

    useEffect(()=>{
        dispatch(orderDetailAction(id))
    },[dispatch,id])


    return(
        /*show loader if loading is true */
        <Fragment>
            { loading ? <Loader/> :
        
            /*show orderDetail if loading is false*/
            <Fragment>
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-details">

                    <h1 className="my-5">{orderDetail._id}</h1>

                    <h4 className="mb-4">Shipping Info</h4>
                    <p><b>Name:</b> {user.name}</p>
                    <p><b>Phone:</b> {shippingInfo.phoneNumber}</p>
                    <p className="mb-4"><b>Address:</b>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}  </p>
                    <p><b>Amount:$</b>{totalPrice}</p>

                    <hr />

                    <h4 className="my-4">Payment</h4>
                    <p className={isPaid ? 'greencolor' : 'redcolor'} ><b>{isPaid ? 'PAID' : 'Not Paid'}</b></p>
                    {/*write css for green color and red color */}

                    <h4 className="my-4">Order Status:</h4>
                    <p className={orderStatus && orderStatus?.toLowerCase().includes('delivered')? 'greencolor' : 'redcolor'} ><b>{orderStatus}</b></p>


                    <h4 className="my-4">Order Items:</h4>
                    {/*here orderItem is an array so we use map function */}

                    <hr />
                    <div className="cart-item my-1">
                            {orderItems && orderItems.map(item=>(
                        <div className="row my-5">
                            <div className="col-4 col-lg-2">
                                <img src={item.image} alt={item.name} height="45" width="65" />
                            </div>

                            <div className="col-5 col-lg-5">
                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                            </div>


                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                <p>${item.price}</p>
                            </div>

                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                <p>{item.quantity} Piece(s)</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <hr />
                </div>
            </div>
            </Fragment>
             }
        </Fragment>

        

        
    )
}