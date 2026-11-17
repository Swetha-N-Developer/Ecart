import React from "react";
import { Fragment } from "react";
import MetaData from "./layouts/MetaData";
import {getProducts} from '../actions/productActions';
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import Loader from "./layouts/Loader";
import Product from "./products/Product";
import{toast} from 'react-toastify';
import ReactPaginate from 'react-paginate';



export default function Home(){

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

  useEffect(()=>{
    if(error){
      return toast.error(error,{
        position : "bottom-center"
      })
    }
    dispatch(getProducts(null,null,null,null,currentPage));
    /*
      send curent page to call backend api with current pagenumber
      sometimes the keyword in search product would be null so pass null parameter to productsAction 
      first value is for keyword and second value is for price and third for rating
    */

  },[dispatch,error,currentPage])
  //dispatch and error are changing values so i gives as a dependency in useEffect hook
 // if error occurs it intimates
  //useEffect  is a hook to fetch data from db and its called at once after the component is crreated
   
  console.log("productsCount:", productsCount);
console.log("resPerPage:", resPerPage);
console.log("pageCount:", Math.ceil(productsCount / resPerPage));

  return(
        <Fragment>
          {loading ? <Loader/> : 
          <Fragment>
          <MetaData title={'Buy  Best Products'}/>
          {/*call metadata for title data*/}
        <h1 id="products_heading">Latest Products</h1>

    <section id="products" className="container mt-5">
      <div className="row">
        {/*here products is field in db*/}
        {products && products.map(product=>(
          <Product col={4} key={product._id} product={product}/>
           ))}
           {/*width of card will be 3  in home component send this value to product component */}

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