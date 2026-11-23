import React from "react";
import { Fragment } from "react";
import MetaData from "../layouts/MetaData";
import { getProducts } from '../../actions/productActions';
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import Loader from "../layouts/Loader";
import Product from "./Product";
import{toast} from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { useParams } from "react-router-dom";
import Slider from 'rc-slider';//slider
import 'rc-slider/assets/index.css';//slider css
import Tooltip from 'rc-tooltip';//show tooltip in pricefilter
import 'rc-tooltip/assets/bootstrap.css';//tooltip css

export default function ProductSearch(){

  const dispatch = useDispatch();//Hook

  const {products,loading,error,productsCount,resPerPage} = useSelector((state)=>state.productsState);
  //productsState is a key in devtools.two properties in productsState.error-error field in state
  //get thesse stastes from devtools

  const [currentPage,setCurrentPage] = useState(1)
  //set state to update currentpage
 

  const setCurrentPageNo = (pageNO) => {
    setCurrentPage(pageNO.selected + 1);
};//pageNO contains page object


  /*create function to get page number
  const setCurrentPageNo = (pageNo) =>{
    setCurrentPage(pageNo) 
  }*/

    
    const[price,setPrice] = useState([1,10000]);//display price dynamically in tooltip
    const[priceChanged,setPriceChanged]=useState(price);//to get the sttae after changed the price in slider
  /*when we use onchnge function the products are refreshed before set both values like starting valud and end value.
  so we set state priceChanged to get the state of changed price*/
  const [category,setCategory] = useState(null);
  //display category
  const [rating,setRating]=useState(0);

  const {keyword} =useParams();//get keyword from url
  const categories = [
    'Electronics',
                'Mobile phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
  ]


 // 1. Background image effect
        useEffect(() => {
    
            document.body.style.backgroundImage = "url('/images/homeBG.png')";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundAttachment = "fixed";
    
            return () => {
                document.body.style.backgroundImage = "";
                document.body.style.backgroundSize = "";
                document.body.style.backgroundPosition = "";
                document.body.style.backgroundRepeat = "";
                document.body.style.backgroundAttachment = "";
            };
    
        }, []);


  useEffect(()=>{
    if(error){
      return toast.error(error,{
        position : "bottom-center"
      })
    }
    dispatch(getProducts(keyword,priceChanged,category,rating,currentPage));
    //send curent page to call backend api with current pagenumber
  },[dispatch,error,keyword,priceChanged,category,rating,currentPage])
    /*
        dispatch and error are changing values so i gives as a dependency in useEffect hook if error occurs it intimates
        useEffect  is a hook to fetch data from db and its called at once after the component is created
        priceChanged - to update price of updated price
     */
   
  console.log("productsCount:", productsCount);
console.log("resPerPage:", resPerPage);
console.log("pageCount:", Math.ceil(productsCount / resPerPage));

  return(
        <Fragment>
          {loading ? <Loader/> : 
          <Fragment>
          <MetaData title={'Buy  Best Products'}/>
          {/*call metadata for title data*/}
        <h1 id="products_heading">Search Products</h1>

    <section id="products" className="container mt-5">
      <div className="row">
          <div className = "col-6 col-md-3 mb-5 mt-5">
            {/*price  filter */}
          <div className = "px-5" onMouseUp={()=>setPriceChanged(price)}>
            {/*mouseUp event is used to display price after take the mouse from the price slider */}
            <Slider 
            range ={true}
            marks ={
              {
                1: "$1",
                10000: "$10000"
              }
              }
              min = {1}
              max ={10000}  
              step ={1}   //increment step of price
              defaultValue ={price}
              onChangeComplete = {(price) => {
        setPrice(price);
    }}

              handleRender ={
                renderProps => {
                  return(
                    
                    <Tooltip overlay={`${renderProps.props['aria-valuenow']}`}>
                    <div {...renderProps.props}></div>
                    </Tooltip>
                    
                     
                  )
                }
              }
            />
        
          </div>
          <hr className ="my-5"/>
          {/*Category Filter */}
          <div classNamae = "mt-5">
            <h3 classNmae="mb-3">Categories</h3>
            <ul className="pl-0">
              {categories.map(category=>
              <li style ={{cursor : "pointer",listStyleType : "none"}}
              key={category}
              
              onClick={()=>{setCategory(category)}}
              >
                {category}
              </li>

)}
            </ul>
          </div>
{/*each list has key acts as an identifier.onClick-when click category it loads products */} 
          <hr/>
          {/*Ratings Filter */}
          <div className="mt-5">
            <h4 className="mb-3">Ratings</h4>
            <ul className="pl-0">
              {[5,4,3,2,1].map(star=>
              <li style ={{cursor : "pointer",listStyleType : "none"}}
              key={star}
              
              onClick={()=>{setRating(star)}}
              >
                <div className="rating-outer">
                  <div className="rating-inner"
                  style={{width:`${star * 20}%`}}>

                  </div>
                   
                </div>
              </li>

)}
            </ul>
          </div>

          </div>

            <div className = "col-6 col-md-9">
              <div className="row">
                   {/*here products is field in db*/}
        {products && products.map(product=>(
          <Product col={4} key={product._id} product={product}/>
       
        ))}

              </div>
            </div>
         
        </div>
    </section>

      {/*pagination only shown if products count exists and greter than resperpage otherwise it shows null*/} 

    {productsCount >0 && productsCount > resPerPage ?(

      <ReactPaginate
          previousLabel={"Previous"}//previous button
          nextLabel={"Next"}//next button
          breakLabel={"..."}//this .... display if there are many pages
          pageCount={Math.ceil(productsCount / resPerPage)}
          /*calculate how many pages should be created 
          if productsCount = 7 resperpage =3 then ceil gives 2.3 =3 
          so 3 pages will be created
          */

          onPageChange={setCurrentPageNo}
          /*when user clicks pagenumber it calls setCurrent PageNo function thencurrent page changes then api calls for product3 
          onPageChange not directly gets the page number it  gets the object like selected:0
          if page is 1
          selected 0 -page 1
          selected 1 -page2
          */

          containerClassName={"pagination justify-content-center"}//css for pagination container
          pageClassName={"page-item"}//apply css to each page number
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"} 
          forcePage={currentPage - 1} 
/>)

:null}


    

   </Fragment>
   }
   
        </Fragment>
    )
}