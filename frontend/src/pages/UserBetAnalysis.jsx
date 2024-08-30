import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { getMatchBets, deleteMatchesBet,  reset } from '../features/matchesBet/matchesBetSlice';
import Spinner from '../components/Spinner';
import SingleMatch from '../components/SingleMatch';
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify'
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

const UserBetAnalysis = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [singleMatch, setSingleMatch] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const { matchBets, isLoading, isError, message } = useSelector((state) => state.matchBets);
    
    useEffect(() => {
        if (isError) {
            console.log(message, "Error fetching match bets");
        }

        if (!user) {
            navigate('/login');
        } else {
            const fetchBets = async () => {
                try {
                    const matchBets = await dispatch(getMatchBets()).unwrap();

                    // Accumulate matches in a nested array structure
                    const allMatches = matchBets.map((single) => single.matches);

                    // Set the nested array of matches to state
                    setSingleMatch(allMatches);
                } catch (error) {
                    console.error('Failed to fetch match bets:', error);
                }
            };
            fetchBets();
        }

        return () => {
            dispatch(reset());
        };
    }, [user, navigate, isError, message, dispatch]);

    const getMatchStats = async (date, homeTeam, awayTeam) => {

        const resMatchstats = await callRapidApi(date.split("T")[0], homeTeam, awayTeam);
        console.log(resMatchstats, "resMatchstats");
        
    }


    const callRapidApi = (date, homeTeam, awayTeam) => {
        const data = JSON.stringify({});

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
            console.log(this.responseText ,"this.responseText");
            }
        });
        
        xhr.open('POST', `https://sportscore1.p.rapidapi.com/events/search-similar-name?date=${date}&page=1&locale=en&sport_id=1&name=${homeTeam}%20-%20${awayTeam}`);
        xhr.setRequestHeader('x-rapidapi-key', '6038627b82mshec5a5dbd6feb18ap143fdajsn488215009ba6');
        xhr.setRequestHeader('x-rapidapi-host', 'sportscore1.p.rapidapi.com');
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.send(data);
    };

    const deleteRealod = async (_id) => {
        try {
            await dispatch(deleteMatchesBet(_id)).unwrap(); // Wait for delete to complete
            // dispatch(getMatchBets()); // Refetch the data
            toast.success("match eliminato con succcesso")
        } catch (error) {
            toast.error("Errore: " + error)
            console.error("Error deleting match bet:", error);
        }
    }
    
    const getNameTips = (tipster) => {
        if (tipster.value && tipster.value.nameTips) {
            return tipster.value.nameTips;
        } else if (tipster.nameTips) {
            return tipster.nameTips;
        }
        return ''; // Default to an empty string if neither is present
    };
        
    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Container style={{ marginTop: "80px" }}>
            <Row>
                <Col xs={12} md={6}>
                    <h2>Analisi giocate</h2>
                    {matchBets && matchBets.length > 0 ? (
                        matchBets.map(({ _id, matches, totalOdds, betPaid, totalWin, profit }, index) => {
                            return (
                                <div key={_id} className="p-3 mb-5 border border-light shadow-sm bg-white rounded">
                                    {matches && matches.length > 0 ? (
                                        matches.map((match, matchIndex) => {
                                            return (
                                                <Fragment key={match._id}>
                                                    {/* {JSON.stringify(match.tipster)} */}
                                                    <div className="border-bottom pb-3 mb-3">
                                                        <div className='d-flex justify-content-between'>
                                                            {matchIndex === 0 && 
                                                                <>  
                                                                    <p>Name: <b><i>{match.tipster.option}</i></b></p>
                                                                    <span className='text-danger' style={{cursor: "pointer"}}><FaRegTrashAlt onClick={() => deleteRealod(_id)} /></span>
                                                                </>
                                                            }
                                                        </div>
                                                        <SingleMatch 
                                                            dateMatch={match.dateMatch} 
                                                            homeTeam={match.homeTeam} 
                                                            awayTeam={match.awayTeam} 
                                                            league={match.league} 
                                                            odds={match.odds} 
                                                            typeOfBet={match.typeOfBet} 
                                                            typeOfBet_choice={match.typeOfBet_choice} 
                                                            matchWin={match.matchWin}
                                                            
                                                        />
                                                        <Stack direction="horizontal" gap={2}>
                                                            <Badge pill className='ms-4 mt-2 p-2 border border-secondary text-secondary' bg="light" style={{cursor: "pointer"}} onClick={() => getMatchStats(match.dateMatch, match.homeTeam, match.awayTeam )}>
                                                                Statistiche
                                                            </Badge>
                                                        </Stack>
                                                    </div>
                                                </Fragment>
                                            );
                                        })
                                    ) : (
                                        <h4>No match data available</h4>
                                    )}
                                    <div className='d-flex justify-content-end mb-3'>
                                        <div className='btn btn-primary px-4'>
                                            <small className='m-0'>Quota {totalOdds}</small>
                                        </div>
                                    </div>
                                    <ListGroup>
                                        <ListGroup.Item>Pagato: {betPaid.toFixed(2)}€</ListGroup.Item>
                                        <ListGroup.Item variant="light">Vincita: {totalWin.toFixed(2)}€</ListGroup.Item>
                                        <ListGroup.Item>Profitto: {profit.toFixed(2)}€</ListGroup.Item>
                                    </ListGroup>
                                </div>
                            );
                        })
                    ) : (
                        <h4>Non ci sono giocate</h4>
                    )}
                </Col>
                <Col xs={12} md={6}>

                    {singleMatch.map((match, index)=> (
                        <Fragment key={index}>
                            <div style={{width : "620px", height: "465px", border: "1px solid black"}}>
                            {JSON.stringify(match)}

                            </div>
                        </Fragment>
                    )) }
                </Col>
            </Row>
        </Container>
    );
};

export default UserBetAnalysis; 
