import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader  from "../layouts/Loader";

export default function ProtectedRoute({children}){

    const { isAuthenticated, loading } = useSelector(state => state.authState)

    if(!isAuthenticated && !loading)//both false
    {
        return <Navigate to='/login'/>
    }

    if(isAuthenticated)//true
    {
        return children;
    }

    if(loading)//true
    {
        return <Loader/>
    }

/* ProtectedRoute - we can access children page or route only if logged in to website
    !isAuthenticated - if not login then it will be redirected to login page 
 */

}