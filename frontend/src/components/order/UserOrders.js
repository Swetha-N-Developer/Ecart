import { useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
//css for mdbreact-ui
//import 'mdb-react-ui-kit/dist/css/mdb.min.css';

//import react mdb ui package and also import its css in src/index.js of frontend
import {
    MDBTable,
    MDBTableHead,
    MDBTableBody
} from "mdb-react-ui-kit";

import { useDispatch, useSelector } from "react-redux";
import { userOrders as userOrdersAction } from "../../actions/orderAction";
import { Link } from "react-router-dom";


export default function UserOrders() {

    //get userOrders from order State in redux
    const { userOrders } = useSelector(state => state.orderState);

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(userOrdersAction());
    },[dispatch])

    // State for search
    const [search, setSearch] = useState("");

    // State for showing entries
    const [entries, setEntries] = useState(10);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);

    // search state - empty -filteredOrders=userOrders
    //search State - not empty - filteredOrders = search value
    const filteredOrders = search
    ? 
    userOrders.filter(
        (order) => order._id.toLowerCase().includes(search.toLowerCase())
      )
    : userOrders;

    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / entries);

    const startIndex = (currentPage - 1) * entries;

    const displayedOrders = filteredOrders.slice(
        startIndex,
        startIndex + entries
    );

    return (
        <>
            <MetaData title="My Orders" />

            <div className="container-fluid px-5 mt-5">

                <h1 className="mb-4">My Orders</h1>

        
                <div className="row align-items-center mb-3">

                    {/* Show entries */}
                    <div className="col-md-6">
                        <label>
                            Show entries
                        </label>
                        <select
                            className="form-select"
                            style={{ width: "200px" }}
                            value={entries}
                            onChange={(e) => {
                                setEntries(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    
                    {/* Search box */}
                    <div className="col-md-6 text-md-end mt-3 mt-md-0">
                        <input
                            type="text"
                            className="form-control"
                            style={{
                                width: "250px",
                                display: "inline-block"
                             }}
                            placeholder="Search"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                         />
                    </div>

                </div>

            {/* Data Table */}
            <MDBTable bordered striped hover responsive>

                    {/* Table headings */}
                    <MDBTableHead>
                        <tr>
                            <th>Order ID</th>
                            <th>Number of Items</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </MDBTableHead>

                {/* Table rows */}
                <MDBTableBody>
                {/* in search part we assigned userOrders to displayed Orders */}
                    { displayedOrders.length > 0 
                    ? 
                    (
                        displayedOrders.map((userOrder) =>
                        (
                            <tr key={userOrder._id}>
                                <td>{userOrder._id}</td>
                                <td>{userOrder.orderItems.length}</td>
                                <td> ${userOrder.totalPrice}</td>

                                <td>
                                 { userOrder.orderStatus && userOrder.orderStatus.includes('delivered') 
                                 ? 
                                 (<p style={{ color: 'green' }}>{userOrder.orderStatus}</p>) 
                                  : 
                                  (<p style={{ color: 'red' }}>{userOrder.orderStatus}</p>)
                                  }
                                 </td>

                                <td>
                                    <Link to={`/order/${userOrder._id}`} className="btn btn-primary">
                                        <i className="fa fa-eye"></i>
                                    </Link>
                                </td>
                            </tr>

                        ))

                            ) : (
                                <tr>
                                    <td colSpan="5">No orders found</td>
                                </tr>
                            )}

                        {/* Repeat table headings at bottom */}

                       

                    </MDBTableBody>

                </MDBTable>

                {/* Table footer */}

                <div className="row align-items-center mt-3">

                    {/* Showing entries */}

                    <div className="col-md-4">

                        Showing {filteredOrders.length === 0 ? 0 : startIndex + 1}
                        {" "}to{" "}
                        {Math.min(startIndex + entries, filteredOrders.length)}
                        {" "}of{" "}
                        {filteredOrders.length} entries

                    </div>

                    {/* Pagination */}

                    <div className="col-md-8 text-md-end">

                        <button
                            className="btn btn-outline-secondary"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </button>

                        <button className="btn btn-warning mx-1">
                            {currentPage}
                        </button>

                        <button
                            className="btn btn-outline-secondary"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>
        </>
    );
}
              

                    
                        
                    

                
           
            

            
               

            

