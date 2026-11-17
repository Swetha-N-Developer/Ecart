import { createSlice } from "@reduxjs/toolkit";
//slice is created for all products.here reducer function is defined for all products state

const cartSlice = createSlice({
    name :'cart',
    initialState :{
        items: localStorage.getItem('cartItems')? JSON.parse(localStorage.getItem('cartItems')):[],
        /*
            localStorage - the application datas are stored in localstorage in application menu of developer tools
            localStorage.getItem('cartItems') - it checks is there any item named 'cartItems' in localStorage
            JSON.parse(localStorage.getItem('cartItems')) -if it exists. the 'cartItems' usually in JSON string it converts JSON string to JSON data.
            [] - if not exists, it creates an empty array
         */

        loading :false,
        shippingInfo : localStorage.getItem('shippingInfo')? JSON.parse(localStorage.getItem('shippingInfo')):[],
        /*
            when we click checkout it will ask about shipping info 
            usually shipping informations are stored in localstorage like cart items
            if we have info in localStorage it takes it as shipping address else it shows an empty array
        */
    },

    reducers:{
        //state1-> if we click add to cart button then request will  send
        addCartItemRequest(state,action)
        {
            return{
                ...state,
                loading : true//loading symbol is shown on website
               
            }
        },

        //state2-> product
        addCartItemSuccess(state,action){
            const item = action.payload;
            //if i click add to cart button then the product details will get from action so here we get it from action

            const isItemExist = state.items.find(i=> i.product === item.product);
            /*
                logic - once the product is added to cart the same product should not be added to cart
                here
                state.items - state of array of cart items that we stored in local storage
                find(i=> i.product === item.product) - find() is a JavaScript array method.
                It searches for an element that satisfies a condition. get products that matches the product id of existing cart items in items array
            */
           
            if(isItemExist)
            {
                //if item exists it preserves the same state it doesnt add new product to add to cart items
               state = {
                ...state,
                loading: false
                }
            }else{
                /*
                    if item doesnot exist then new products will be added to cart items in localstorage
                    state.items - cart items
                    item - products we get from action
                */
                state = {
                    items : [...state.items, item],
                    loading :false
                }
                localStorage.setItem('cartItems',JSON.stringify(state.items));
                /*
                    localStorage -	Browser storage
                    setItem() -	Saves data in localStorage
                    'cartItems' -	Key used to identify the saved data
                    JSON.stringify() -	Converts JavaScript data into a JSON string
                    state.items	- Cart products to be saved

                    Why JSON.stringify()?
                    Because localStorage stores values as strings.
                */

            }
            return state//then return state based on conditions
        },

        //reducers for handling cartItems Quantity
        //increase quantity
        increaseCartItemQty(state,action)
        {
            state.items = state.items.map(item =>{

                //from action we get productid of product .here we compare the product id with cart item product id
                if(item.product === action.payload){
                    //item.product - itemproductid and payload - product productid
                    item.quantity = item.quantity + 1
                }
                return item;
        })
        localStorage.setItem('cartItems',JSON.stringify(state.items));//save qty

        },

        //decrease quantity
         decreaseCartItemQty(state,action)
        {
            state.items = state.items.map(item =>{

                //from action we get productid of product .here we compare the product id with cart item product id
                if(item.product === action.payload){
                    //item.product - itemproductid and payload - product productid
                    item.quantity = item.quantity - 1
                }
                return item;
        })
        localStorage.setItem('cartItems',JSON.stringify(state.items));//save qty

        },

        //delete cart item
        removeItemFromCart(state,action){
            /*filter function - filter all products in cart except remove item */
            const filterItems = state.items.filter(item => {
                return item.product !== action.payload
            })
             localStorage.setItem('cartItems',JSON.stringify(filterItems));//save qty
            return {
                ...state,
                items : filterItems
            }
        },

        //shipping reducer
        saveShippingInfo(state, action){
            //if there is no shipping address in localstorage it gets it from action and save it in localstorage
            localStorage.setItem('shippingInfo', JSON.stringify(action.payload));//save qty
            //action.payload - data from action
            return{
                ...state,
                shippingInfo : action.payload
            }
        },

        //after payment success(payment component)
        orderCompleted(state, action)
        {
           // localStorage.removeItem('shippingInfo');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('orderInfo');
            return{
                items : [],
                loading : false,
               // shippingInfo : {}
               shippingInfo : localStorage.getItem('shippingInfo')? JSON.parse(localStorage.getItem('shippingInfo')):[],
            }



        }



        
    }

});

const { actions,reducer } = cartSlice;
//create actions - action names are same as reducer so we get it from productsSlice and save it as action creators

export const { 
    addCartItemRequest, 
    addCartItemSuccess, 
    increaseCartItemQty, 
    decreaseCartItemQty,
    removeItemFromCart,
    saveShippingInfo,
    orderCompleted
    } = actions;

export default reducer;
//now  define all reducers in combinereducers of store.js