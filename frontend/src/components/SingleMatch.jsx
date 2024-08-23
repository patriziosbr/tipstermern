import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getMatch, reset  } from '../features/matches/matchSlice';
import Spinner from '../components/Spinner';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

// ICONE FILL CON FONDO NERO/PIENO
// import { BsFillDashCircleFill } from "react-icons/bs";
// import { BsFillXCircleFill } from "react-icons/bs";
// import { BsCheckCircleFill } from "react-icons/bs";

import { BsCheckCircle } from "react-icons/bs";
import { BsDashCircle } from "react-icons/bs";
import { BsXCircle } from "react-icons/bs";


const SingleMatch = ({dateMatch, homeTeam, awayTeam, league, odds, typeOfBet, typeOfBet_choice}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { matches, isLoading, isError, message } = useSelector((state) => state.matches);

    useEffect(() => {
        if (isError) {
            console.log(message, "message");
        }

        if (!user) {
            navigate('/login');
        }

        dispatch(getMatch())
        
        return () => {
            dispatch(reset());
        };
    }, [user, navigate, isError, message, dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

    const isoToDateFormatter = (paramDate) => {
        let date = new Date(paramDate);
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let dt = date.getDate();
        
        if (dt < 10) {
          dt = '0' + dt;
        }
        if (month < 10) {
          month = '0' + month;
        }
        let parseDate = `${dt}/${month}/${year}`
        return parseDate
    }


    return (
        <>
        {/* <Card>
        <Card.Body> */}


            <div style={{ display:'flex' }}>
                <div style={{ width: '30px' }} className='d-flex align-items-center'>
                    <div style={{borderRadius:"100%", backgroundColor:"green", height:"15px", width:"15px"}}></div>
                    {/* <BsDashCircle size='30'/> */}
                    {/* <BsXCircle size='30' />*/}
                    {/* <BsCheckCircle size='30' />  */}
                </div>
                <div className='d-flex justify-content-between w-100'>
                    <div className='w-75'>
                        <small className="mb-2 text-muted" >{isoToDateFormatter(dateMatch)} - {league}</small>
                        <Card.Title >{homeTeam} - {awayTeam}</Card.Title>
                        <Card.Text>
                        {typeOfBet}
                        </Card.Text>
                    </div>
                    <div style={{ textAlign: "end" }} className='d-flex flex-column justify-content-end'>
                        <p className='m-0'><b>{typeOfBet_choice}</b></p>
                        <p className='m-0'><b>{odds}</b></p>
                    </div>
                </div>
            </div>

            {/* <Button variant="primary">Go somewhere</Button> */}
        {/* </Card.Body>
        </Card> */}
        </>
    );
};

export default SingleMatch;
