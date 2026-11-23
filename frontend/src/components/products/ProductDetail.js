import {Fragment, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../actions/productActions';
import Loader from "../layouts/Loader";
//import Carousel from 'react-bootstrap/Carousel';
import { Carousel } from "react-bootstrap";
import MetaData from "../layouts/MetaData";
import { addCartItems } from '../../actions/cartAction';
import { toast } from "react-toastify";


export default  function ProductDetail(){

    const dispatch = useDispatch();//usedispatch is a hook for using dispatch fn
    const { id } = useParams();//useparams is a hook to get id from url
    const { product, loading} =useSelector((state)=>state.productState);
    //productSate is a key in devtool state based on this we get product and loading data

    const { items } = useSelector(state=>state.cartState);
 

    //state for increas/decrease quantity
    const[ quantity, setQuantity ] = useState(1);//initial value is 1 because default value shows in browser is 1

    //function to increment value in + button
    const increaseQty =()=>{
        const count = document.querySelector('.count')
        //.count is a class in productDetail html to get count value from input field

        if(product.stock === 0 || count.valueAsNumber >= product.stock) return;
        /* 
        here two conditions:
            stock != 0 and count in browser >= stock value
            if two conditions are true then it stops continuing execution 
            if any one value is false it executes the next code
        for example :
            stock =5 and count =6 --> stops executing means we cant increase the value
            stock =5 and count =3 --> it executes the next line and we can increase the value

            && - if both value true then only it stop execution.if any one false it continues execution
            || - it stops execution if any one value false or both value is true

            valueasnumber - convert the value to number
         */

        const qty = count.valueAsNumber + 1;
        //increrment the value when we press + button

        setQuantity(qty)
        //update the value
    }

    //function to decrease the value
    const decreaseQty = () => {
        const count = document.querySelector('.count');

        if(count.valueAsNumber === 1) return;
        //count value is 1  it shouldnot decreament the value

        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }

   const addToCartHandler = async () => {

    // Check whether the product is already in the cart
    const isAlreadyInCart = items.some(
        item => item.product === product._id
    );

    if (isAlreadyInCart) {
        toast.error('Already in cart!', {
            position: 'top-right'
        });
        return;
    }

    try {
        await dispatch(addCartItems(product._id, quantity));

        toast.success('Added to Cart!', {
            position: 'top-right'
        });

    } catch (error) {
        toast.error('Failed to add product to cart!', {
            position: 'top-right'
        });
    }
};

    //useEfffect is hook to fetch data from db 
    useEffect(()=>{
        dispatch(getProduct(id))//call getproduct fn in productAction
         
    },[dispatch,id])

// console.log('product_id',product._id);
                //console.log('quantity',quantity);                    

    return(
        <Fragment>
           
           {loading ? <Loader/> :
           
            

        <Fragment>


             <MetaData title={product.name}/>
             
           <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">

                

                  {/* {product.images && product.images.map(image => (
    <img
        key={image._id}
        src={image.image}
        alt={product.name}
        height="500"
        width="500"
    />
))}*/}


  {product.images && product.images.length > 0 && (
            <Carousel>

                {product.images.map(image => (
                    <Carousel.Item key={image._id}>
                        <img
                            className="d-block w-100"
                            src={image.image}
                            alt={product.name}
                            height="500"
                            width="500"
                        />
                    </Carousel.Item>
                ))}

            </Carousel>
        )}

    


                  {/*<Carousel pause="hover">
                        {product.images && product.images.map(image=>
                            <Carousel.Item key={image._id}>
                                <img className="d-block w-100" src={image.image} alt={product.name} height="500" width="500"/>

                            </Carousel.Item>
                        )}
                    </Carousel>*/}
                  
                </div>

            <div className="col-12 col-lg-5 mt-5">
                <h3>{product.name}</h3>
                <p id="product_id">Product {product._id}</p>

                <hr/>

                <div className="rating-outer">
                    <div className="rating-inner" style={{width : `${product.ratings/5*100}%`}}></div>
                </div>
                <span id="no_of_reviews">({product.numOfReviews}Reviews)</span>

                <hr/>

                <p id="product_price">${product.price}</p>
                <div className="stockCounter d-inline">
                    <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                    <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                    <span className="btn btn-primary plus" onClick = {increaseQty} >+</span>
                </div>
                 <button type="button"
                         id="cart_btn" 
                        onClick={addToCartHandler}
                         //send product id and quantity to cartAction

                         

                         disabled={product.stock === 0 ? true : false} 
                         className="btn btn-primary d-inline ml-4"
                >Add to Cart</button>
                    {/* disable cart button if product.stock is 0 */}
                <hr/>
               

                <p>Status: <span className ={product.stock>0 ? 'greenColor' : 'redColor'} id="stock_status">{product.stock>0 ? 'In Stock' : 'Out of Stock'}</span></p>

                <hr/>

                <h4 className="mt-2">Description:</h4>
                <p>{product.description}</p>
                <hr/>
                <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
				
				<button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                            Submit Your Review
                </button>
				
				<div className="row mt-2 mb-5">
                    <div className="rating w-50">

                        <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">

                                        <ul className="stars" >
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                        </ul>

                                        <textarea name="review" id="review" className="form-control mt-3">

                                        </textarea>

                                        <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
				</div>		
            </div>

        </div>

    </Fragment>

}
        </Fragment>

    )
}