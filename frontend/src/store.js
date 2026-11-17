import {configureStore,combineReducers} from '@reduxjs/toolkit';
//import thunk from 'redux-thunk';thunk middleware is already included reducx toolkit
import productsReducer from './slices/productsSlice';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';


const reducer = combineReducers({
    productsState : productsReducer,//reducer for home component
    productState : productReducer,//reducer for prodductdetail component
    authState : authReducer,
    cartState : cartReducer,
    orderState : orderReducer


})
const store =configureStore({
    //configure store is a redux store that keeps all state data

    reducer,
    /*reducer is a function that tells how state changes when  action happened*/
    
    //middleware : [thunk]
    //thunk is a middleware to perform asynchronous operation inside redux action including api calls


})
export default store;