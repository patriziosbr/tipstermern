import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Carousel from '../components/utils/carousel/Carousel'
import {
    getMaxWin,
    reset
  } from "../../src/features/matchesBet/matchesBetSlice";
  import Spinner from "../components/Spinner";
  

function CarouselContainer() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { matchBets, isLoading, isError, message } = useSelector(
        (state) => state.matchBets
      );

      useEffect(() => {
        const matchBets = dispatch(getMaxWin()).unwrap();
        console.log(matchBets, "match matchBets matchBets");
      
        if (isError) {
          console.log(message, "Error fetching match bets");
        }
      
        return () => {
          dispatch(reset());
        };
      }, [user, navigate, isError, message, dispatch]);

      if (isLoading) {
        return <Spinner />;
      }

    return (
    <div style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', marginTop: 64, height: 300, }}>
        <Carousel
            show={2}
        >
            <div>
                <div style={{padding: 8, height: 300}}>
                    <img src="https://via.placeholder.com/300x300" alt="placeholder" style={{width: '100%'}} />
                </div>
            </div>
            <div>
                <div style={{padding: 8}}>
                    <img src="https://via.placeholder.com/300x300" alt="placeholder" style={{width: '100%'}} />
                </div>
            </div>
            <div>
                <div style={{padding: 8}}>
                    <img src="https://via.placeholder.com/300x300" alt="placeholder" style={{width: '100%'}} />
                </div>
            </div>
        </Carousel>
    </div>  
  )
}

export default CarouselContainer




