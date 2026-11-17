import { Link } from "react-router-dom";

export default function Checkoutsteps({shipping, confirmOrder, payment}){
    //in checkoutsteps we are having 3 values
    return(
        <div className="checkout-progress d-flex justify-content-center mt-5">
            {
            shipping ?//if we are in shipping page
            <Link to= '/shipping'>
                <div className="triangle2-active"></div>
                <div className="step active-step">Shipping Info</div>
                <div className="triangle-active"></div>
            </Link>
            ://not in shipping page
             <Link to= '/shipping'>
                <div className="triangle2-incomplete"></div>
                <div className="step incomplete">Shipping Info</div>
                <div className="triangle-incomplete"></div>
            </Link>
            }

            {
            confirmOrder ?//if we are in shipping page
            <Link to= '/order/confirm'>
                <div className="triangle2-active"></div>
                <div className="step active-step">Confirm Order </div>
                <div className="triangle-active"></div>
            </Link>
            ://not in shipping page
             <Link to= '/order/confirm'>
                <div className="triangle2-incomplete"></div>
                <div className="step incomplete">Confirm Order</div>
                <div className="triangle-incomplete"></div>
            </Link>
            }

            {
            payment ?//if we are in shipping page
            <Link to= '/order/payment'>
                <div className="triangle2-active"></div>
                <div className="step active-step">Payment</div>
                <div className="triangle-active"></div>
            </Link>
            ://not in shipping page
             <Link to= '/order/payment'>
                <div className="triangle2-incomplete"></div>
                <div className="step incomplete">Payment</div>
                <div className="triangle-incomplete"></div>
            </Link>
            }
        </div>

    )
}