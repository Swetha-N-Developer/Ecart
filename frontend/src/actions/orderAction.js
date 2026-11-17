import { createOrderFail, createOrderRequest, createOrderSuccess, OrderDetailFail, orderDetailRequest, orderDetailSuccess, userOrdersFail, userOrdersRequest, UserOrdersSuccess } from "../slices/orderSlice"
import axios from 'axios';


//createOrder Action
export const createOrder = order => async(dispatch) =>{
    try{
        dispatch(createOrderRequest())
       const {data} = await axios.post(`/api/v1/orders/new`,order)//url for place order
       dispatch(createOrderSuccess(data));
    }
    catch(error){
        //dispatch(createOrderFail(error.response.data.message))

      

    dispatch(createOrderFail(
        error.response?.data?.message || error.message
    ));

    throw error;

    }
}

//userOrders Action

export const userOrders = id => async(dispatch) =>{
    try{
        dispatch(userOrdersRequest())
       const {data} = await axios.get(`/api/v1/orders/myorders`);
       //get user details of logged in user
       dispatch(UserOrdersSuccess(data));
    }
    catch(error){
        //dispatch(createOrderFail(error.response.data.message))

        dispatch(userOrdersFail(
            error.response?.data?.message || error.message
        ));
    
        throw error;
    
        }
    }

//orderDetail - detail of single order if i click view button in orders page

export const orderDetail = (id) => async(dispatch) =>{
    try{
        dispatch(orderDetailRequest())
       const {data} = await axios.get(`/api/v1/order/${id}`);
       //get user details of logged in user
       dispatch(orderDetailSuccess(data));
    }
    catch(error){
        //dispatch(createOrderFail(error.response.data.message))

        dispatch(OrderDetailFail(
            error.response?.data?.message || error.message
        ));
    
        throw error;
    
        }
    }
     
