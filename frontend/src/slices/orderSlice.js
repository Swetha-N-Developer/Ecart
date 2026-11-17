import { createSlice } from "@reduxjs/toolkit";
//slice is created for all products.here reducer function is defined for all products state

const orderSlice = createSlice({
    name :'order',
    initialState :{
        orderDetail : {},//detail of single order
        userOrders : [],//details of single user orders
        loading: false
    },

    reducers:{
       createOrderRequest(state, action){
        return{
            ...state,
            loading: true
        }

       },

       createOrderSuccess(state, action){
        return{
            ...state,
            loading : false,
            orderDetail : action.payload.order
        }
       },

       createOrderFail(state, action){
        return{
            ...state,
            loading : true,
            error : action.payload
        }
       },

       clearOrderError(state,action)
       {
        return{
            ...state,
            error:null
        }
       },

       //user ordersPage
       userOrdersRequest(state, action){
        return{
            ...state,
            loading: true
        }

       },

       UserOrdersSuccess(state, action){
        return{
            ...state,
            loading : false,
            userOrders : action.payload.orders
        }
       },

       userOrdersFail(state, action){
        return{
            ...state,
            loading : true,
            error : action.payload
        }
       },

       //orderDetail Component(backend - GEt single order route)
       orderDetailRequest(state, action){
        return{
            ...state,
            loading: true
        }

       },

       orderDetailSuccess(state, action){
        return{
            ...state,
            loading : false,
            orderDetail : action.payload.order
        }
       },

       OrderDetailFail(state, action){
        return{
            ...state,
            loading : true,
            error : action.payload
        }
       },


    }

});

const { actions,reducer } = orderSlice;
//create actions - action names are same as reducer so we get it from productsSlice and save it as action creators

export const { 
    createOrderRequest,
    createOrderSuccess,
    createOrderFail,
    clearOrderError,
    userOrdersFail,
    userOrdersRequest,
    UserOrdersSuccess,
    orderDetailRequest,
    orderDetailSuccess,
    OrderDetailFail
    } = actions;

export default reducer;
//now  define all reducers in combinereducers of store.js