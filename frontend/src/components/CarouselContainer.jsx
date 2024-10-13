import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Carousel from '../components/utils/carousel/Carousel'
import {
    getMaxWin,
    reset
  } from "../../src/features/matchesBet/matchesBetOverAllSlice";
  import Spinner from "../components/Spinner";

  

  function CarouselContainer() {
    const { overAll, isLoading, isError, message } = useSelector((state) => state.overAll); // Fix this to match Redux slice
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
  
    useEffect(() => {
      if (user) {
        dispatch(getMaxWin()); // Dispatch action only when user is available
      }
      
      // Optionally reset state on component unmount
      return () => {
        dispatch(reset());
      };
    }, [user, dispatch]); // Only include relevant dependencies to avoid unnecessary re-fetching
  
    // Handle loading, error, or display data
    if (isLoading) {
      return <Spinner />;
    }
  
    if (isError) {
      return <div>Error: {message}</div>;
    }

    return (
    <div style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', marginTop: 64, height: 300, }}>
      {/* {overAll && overAll.length > 0 ? (
        <ul>
          {overAll.map((item, index) => (
            <p>xxx</p>
          ))}
        </ul>
      ) : (
        <div>No Data Available</div>
      )} */}
        <Carousel
            show={2}
        >
            <div>
                <div style={{padding: 8, height: 300}}>
                    <img src="https://via.placeholder.com/300x300" alt="placeholder" style={{width: '100%'}} />
                </div>
            </div>
            <div>
                <div style={{padding: 8, height: 300}}>
                    <img src="https://via.placeholder.com/300x300" alt="placeholder" style={{width: '100%'}} />
                </div>
            </div>
            <div>
                <div style={{padding: 8, height: 300}}>
                    <img src="https://via.placeholder.com/300x300" alt="placeholder" style={{width: '100%'}} />
                </div>
            </div>
        </Carousel>
    </div>  
  )
}

export default CarouselContainer




