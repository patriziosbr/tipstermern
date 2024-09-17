import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// // import Container from 'react-bootstrap/Container';
// // import Row from 'react-bootstrap/Row';
// // import Col from 'react-bootstrap/Col';
// import { getMatch, reset  } from '../features/matches/matchSlice';
// import Spinner from '../components/Spinner';

// // import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

// ICONE FILL CON FONDO NERO/PIENO
// import { BsFillDashCircleFill } from "react-icons/bs";
// import { BsFillXCircleFill } from "react-icons/bs";
// import { BsCheckCircleFill } from "react-icons/bs";

// import { BsCheckCircle } from "react-icons/bs";
// import { BsDashCircle } from "react-icons/bs";
// import { BsXCircle } from "react-icons/bs";


const SingleMatch = ({matchID, dateMatch, homeTeam, awayTeam, league, odds, typeOfBet, typeOfBet_choice, matchWin, settermatchstats}) => {
  const [matchData, setMatchData] = useState({}); 

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
    const handleFetchTodo = async () => {
        // Await the result of settermatchstats and set it directly to state
        const matchStats = await settermatchstats(dateMatch, homeTeam, awayTeam, matchID);
        if (matchStats) {
          setMatchData(matchStats); // Set match data in state
        }
      };
      
    return (
        <>
        {/* <Card>
        <Card.Body> */}


            <div style={{ display:'flex' }}>
                <div style={{ width: '30px' }} className='d-flex align-items-center'>
                    {matchWin === 1 && <div style={{borderRadius:"100%", backgroundColor:"green", height:"15px", width:"15px"}}></div>}
                    {matchWin === 0 && <div style={{borderRadius:"100%", backgroundColor:"red", height:"15px", width:"15px"}}></div>}
                    {matchWin === 2  && <div style={{borderRadius:"100%", backgroundColor:"yellow", height:"15px", width:"15px"}}></div>}
                    {/* {matchWin === true && <BsDashCircle size='30'/>}
                    {matchWin === false && <BsXCircle size='30' />}
                    {matchWin === null && <BsCheckCircle size='30' />} */}
                </div>
                <div className='d-flex justify-content-between w-100'>
                    <div className='w-75'>
                        <small className="mb-2 text-muted" >{isoToDateFormatter(dateMatch)} - {league}</small>
                        <Card.Title ><a href="#" onClick={handleFetchTodo}>{homeTeam} - {awayTeam} </a></Card.Title>
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
