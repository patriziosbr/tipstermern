import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getMatchBets, reset } from '../features/matchesBet/matchesBetSlice';
import { getMatch } from '../features/matches/matchSlice';
import Spinner from '../components/Spinner';
import SingleMatch from '../components/SingleMatch';
import ListGroup from 'react-bootstrap/ListGroup';

const UserBetAnalysis = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { matchBets, isLoading, isError, message } = useSelector((state) => state.matchBets);
    const [matchesData, setMatchesData] = useState([]);
    const [filteredMatchesData, setFilteredMatchesData] = useState([]);
    const [betPaid, setBetPaid] = useState(2);
    const [winLoss, setWinLoss] = useState([]);


    useEffect(() => {
        if (isError) {
            console.log(message, "message");
        }

        if (!user) {
            navigate('/login');
        }

        dispatch(getMatchBets());
        // Fetch match data
        dispatch(getMatch()).then((response) => {
          if (response.payload) {
              setMatchesData(response.payload);
          }
        }).catch(err => {
            console.error('Failed to fetch match data:', err);
        });
        
        return () => {
            dispatch(reset());
        };
    }, [user, navigate, isError, message, dispatch]);

    useEffect(() => {
        if (matchBets.length > 0 && matchesData.length > 0) {
            const allFilteredMatches = matchBets.map(matchBet => {
                // Filter matches related to this matchBet
                let vincita;
                let profitto;
                const relatedMatches = matchesData.filter(match => matchBet.matches.includes(match._id));
    
                // Calculate the total odds for this matchBet by multiplying all related matches' odds
                const totalOdds = relatedMatches.reduce((betAcc, match) => {
                    const matchOdds = parseFloat(match.odds.replace(',', '.')) || 1; // Convert odds string to a float, handle comma, default to 1
                    return betAcc * matchOdds; // Multiply odds together
                }, 1); // Start with 1 to avoid multiplying by 0
                 
                if(matchBet.isWin) {
                    vincita = totalOdds.toFixed(2) * betPaid
                    profitto = totalOdds.toFixed(2) * betPaid - betPaid
                } else if (matchBet.isWin === null) {
                    vincita = 1 * betPaid
                    profitto = 1 * betPaid - betPaid
                } else {
                    vincita = 0 * betPaid
                    profitto = 0 * betPaid - betPaid
                }
                
                return {
                    matchBetId: matchBet._id,
                    relatedMatches,
                    totalOdds, // Store the total odds
                    vincita,
                    profitto: profitto.toFixed(2)
                };
            });

            setFilteredMatchesData(allFilteredMatches);
    
            console.log("All Filtered Matches with Total Odds:", allFilteredMatches);
        }
    }, [matchBets, matchesData]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            <Container style={{ marginTop: "80px" }}>
                <Row>
                    <Col xs={12}>
                        <h2>Analisi giocate</h2>
                        {filteredMatchesData.length > 0 ? filteredMatchesData.map(({ matchBetId, relatedMatches }, index ) => (
                            <div key={matchBetId} className="p-3 mb-5 border border-light shadow-sm bg-white rounded">
                                {relatedMatches.length > 0 ? (
                                    relatedMatches.map((match, index) => (
                                        <Fragment key={match._id} >
                                        <div key={match._id} className="border-bottom pb-3 mb-3" >
                                            <p>Name: <b><i>{match.tipster.value.nameTips}</i></b></p>
                                            <SingleMatch dateMatch={match.dateMatch} homeTeam={match.homeTeam} awayTeam={match.awayTeam} league={match.league} odds={match.odds} typeOfBet={match.typeOfBet} typeOfBet_choice={match.typeOfBet_choice} />
                                        </div>
                                        </Fragment>
                                    ))
                                ) : (
                                    <h4>No match data available</h4>
                                )}
                                <div className='d-flex justify-content-end mb-3'>
                                    <div className='btn btn-primary px-4'>
                                        <small className='m-0'>Quota {filteredMatchesData[index].totalOdds.toFixed(2)}</small>
                                    </div>
                                </div>
                                <ListGroup>
                                        <ListGroup.Item>Pagato: {betPaid}€</ListGroup.Item>
                                        <ListGroup.Item variant="light">Vincita: {filteredMatchesData[index].vincita}€</ListGroup.Item>
                                        <ListGroup.Item>Profitto: {filteredMatchesData[index].profitto}€</ListGroup.Item>
                                </ListGroup>
                            </div>
                        )) : (
                            <h4>Non ci sono giocate</h4>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default UserBetAnalysis;
