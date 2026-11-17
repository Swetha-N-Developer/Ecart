import axios from 'axios';//middleware to call apis in backend

import { productsFail,productsSuccess,productsRequest } from '../slices/productsSlice';
//import action creators from productsSlice.js

import { productFail,productSuccess,productRequest } from '../slices/productSlice';
//import action creators from productsSlice.js

//for all products
export const getProducts =(keyword,price,category,rating,currentPage,)  => async(dispatch) =>{
    //dispatch is redux fn to send actions to reducer to update state
    //dispatch fn is created only with component
    //cuurent page get from home component  

    try{
        dispatch(productsRequest())

        let link =`/api/v1/products?page=${currentPage}`;
        //store api link in link variable

        if(keyword)//sometimes keyword will be null so we check here
        {
          link +=`&keyword=${keyword}`
          //get the key value and set it as a query parameter to keyword and append it to api
        }

        if(price)
        {
          link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`
          //it takes array value as arguments
        }
        if(category)
        {
          link += `&category=${category}`
        }
        if(rating)
        {
          link += `&ratings=${rating}`
        }
        const {data} = await axios.get(link);
        //backend api to get products and store data in data variable
        //current page is a query to backend api

        dispatch(productsSuccess(data))
  }
  catch(error)
  {
    //handle error
    dispatch(productsFail(error.response.data.message))
    //error-error object in state response.message - error message field in backend
  }
}


//for single product
export const getProduct = id => async(dispatch) =>{
    //id is a parameter get from productdetail component.getproduct is called in product detail component
    //dispatch is redux fn to send actions to reducer to update state
    //dispatch fn is created only with component

    try{
        dispatch(productRequest())//send an action to reducer with or without data

        const {data} = await axios.get(`/api/v1/product/${id}`);

        //backend api to get products and store data in data variable

        dispatch(productSuccess(data))
  }
  catch(error)
  {
    //handle error
    dispatch(productFail(error.response.data.message))
    //error-error object in state response.message - error message field in backend
  }
}