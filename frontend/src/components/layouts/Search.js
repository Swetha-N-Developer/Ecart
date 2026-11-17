
import {useState} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Search()
{

  const[keyword,setKeyword]=useState("");
//set state to get data from search box and store it as a keyword

//useNavigate - hook to move to particular location
const navigate = useNavigate();

const location =useLocation();//gives the location of url path


//defnition of searchHandler
const searchHandler =(e)=>{
    e.preventDefault();//prevent page refresh
    navigate(`/search/${keyword}`);
  }

  const clearKeyword = () =>{
      setKeyword("");
  }
    //when path changed it should be cleared
    useEffect(()=>{
      if(location.pathname ==='/')
      {
        clearKeyword();
      }
    },[location])

    return(
        <form onSubmit={searchHandler}>
            {/* when submit is clicked it calls searchHandlerfunction*/}

            <div className="input-group">
          <input
            type="text"
            id="search_field"
            className="form-control"
            placeholder="Enter Product Name ..."
            onChange={(e)=>{setKeyword(e.target.value)}} 
            value={keyword}
              
          />

         {/*setKeyword is a function to get the value from search box.value is a keyword to store the value as a keyword*/}

          <div className="input-group-append">
            <button id="search_btn" className="btn" >
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        </form>
    )
}