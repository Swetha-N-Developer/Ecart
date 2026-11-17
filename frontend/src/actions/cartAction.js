import { addCartItemRequest, addCartItemSuccess } from '../slices/cartSlice'
import axios from 'axios'//connect backend
export const addCartItems = (id, quantity) => async(dispatch) => {
    try {
        //call reducers
        dispatch(addCartItemRequest());

        const { data } = await axios.get(`/api/v1/product/${id}`);
        /*
        this is the backend url of get single product baecause we need to get the product details when we click add to cart button
        {data} - single product Detail
        */

        dispatch(addCartItemSuccess({
            //these values will be stored as items array in local storage 
            product : data.product._id,
            name : data.product.name,
            price : data.product.price,
            image : data.product.images[0].image,
            stock : data.product.stock,
            quantity
             }));

            /*
            data -contains success and product field 
            data.product - access the product field
            using data.product we are going to access some fields from product field for add to cart
            images[0].image - images is an array in product field .images array can have multiple images.
            images[0] - get the first image in array
            image - value in images arrray(name of image)
            quantity - get it from product detail component(number of same products we want to add )
            */

       
            

        }catch(error)
        {

        }
    
}