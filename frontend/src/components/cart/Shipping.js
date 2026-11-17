import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { countries } from 'countries-list'//countries-list package for country list in input field
import { saveShippingInfo } from '../../slices/cartSlice'
import { useNavigate } from "react-router-dom";
import Checkoutsteps from "./Checkoutsteps";
import { toast } from 'react-toastify';

export const validateShipping = (shippingInfo, navigate) =>{
    if(
        !shippingInfo.address ||
        !shippingInfo.city ||
        !shippingInfo.phoneNo ||
        !shippingInfo.postalCode||
        !shippingInfo.country ||
        !shippingInfo.state 
        ){
        toast.error('please fill the shipping Information',{
            position : "bottom-center"
        });
        navigate('/shipping');
    }
}

export default function Shipping(){
    const { shippingInfo = {} } = useSelector(state => state.cartState);
    //if shipping info is exists in local storage then we need to get it into input fields so we get shipping info from state
    
    //create useState for all input values
    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    const [country, setCountry] = useState(shippingInfo.country);
    const [state, setState] = useState(shippingInfo.state);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //conuntry list package
    const countryList = Object.values(countries);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingInfo({address, city, phoneNo, postalCode, country, state}))
        /*
        dispatch - send reducer with shipping input values to the action
        in saveShippingInfo reducer we already declared setItem so it save data to local storage.
        so here we are using values directly in dipatch hook
        */
       navigate('/order/confirm')
       //load confirm page after saved shipping details
    }


    return(
        <Fragment>
        <Checkoutsteps shipping={true}/>{/* call component of checkoutSteps .true value means shipping page is active now*/}
         <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange ={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange ={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange ={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={postalCode}
                                onChange ={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                 value={country}
                                onChange ={(e) => setCountry(e.target.value)}
                                required
                            >
                                { countryList.map((country,i) => (

                                    <option key ={i} value={country.name}>
                                        {country.name}
                                    </option>
                                    
                                ))
                                /*
                                array.map((item, index) => {})
                                countryList is an arry in contries-list package
                                */
                                }


                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">State</label>
                            <input
                                type="text"
                                id="state_field"
                                className="form-control"
                                 value={state}
                                onChange ={(e) => setState(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                            </button>
                    </form>
                </div>
            </div>
            </Fragment>
    )
}