import { createSlice } from "@reduxjs/toolkit";
//slice is created for all products.here reducer function is defined for all products state

const productSlice = createSlice({
    name :'product',
    initialState :{
        loading : false,
        product : {},
        error : null//initially load symbol is false
        },

    reducers:{
        //state1-> send request to get products
        productRequest(state,action)
        {
            return{
                loading : true,
                product : {},
                error : null//loading symbol is shown on website
            }
        },

        //state2-> products fetched
        productSuccess(state,action){
            return{
                loading: false,//loading symbol is not shown
                product : action.payload.product,
                error : null
                //payload-fetched data fom db(state data),products- field in database
              
            }
        },

        //state-3 -> products not fetched
        productFail(state,action){
            return{
                loading :false,
                product : {},
                error : action.payload,
                //error is an error field in state 
            }
        }
    }

});

const { actions,reducer } = productSlice;
//create actions - action names are same as reducer so we get it from productsSlice and save it as action creators

export const {productRequest,productSuccess,productFail} = actions;

export default reducer;
//now  define all reducers in combinereducers of store.js