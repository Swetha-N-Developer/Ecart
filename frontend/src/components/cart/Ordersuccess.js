import { useEffect } from "react";
import { Link } from "react-router-dom";

 export default function Ordersuccess(){
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
    return(
         <div className="row justify-content-center">
            <div className="col-6 mt-5 text-center">
                <img className="my-5 img-fluid d-block mx-auto" src="/images/success-winner.gif" alt="Order Success" width="200" height="200" />

                <h2>Your Order has been placed successfully.</h2>

                <Link to="/orders">Go to Orders</Link>
            </div>

        </div>
    )
}