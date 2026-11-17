import { createSlice } from "@reduxjs/toolkit";
//slice is created for all products.here reducer function is defined for all products state

const productsSlice = createSlice({
    name :'products',
    initialState :{
        loading : false//initially load symbol is false
    },

    reducers:{
        //state1-> send request to get products
        productsRequest(state,action)
        {
            return{
                loading : true //loading symbol is shown on website
            }
        },

        //state2-> products fetched
        productsSuccess(state,action){
            return{
                loading: false,//loading symbol is not shown
                products : action.payload.products,
                //payload-fetched data fom db(state data),products- field in database
                  productsCount : action.payload.count,
                //get total count of products in db from postman variablee
                resPerPage : action.payload.resPerPage
                //get resPerPage value from postman
            }
        },

        //state-3 -> products not fetched
        productsFail(state,action){
            return{
                loading :false,
                error : action.payload//error is an error field in state 
            }
        }
    }

});

const { actions,reducer } = productsSlice;
//create actions - action names are same as reducer so we get it from productsSlice and save it as action creators

export const {productsRequest,productsSuccess,productsFail} = actions;

export default reducer;
//now  define all reducers in combinereducers of store.js