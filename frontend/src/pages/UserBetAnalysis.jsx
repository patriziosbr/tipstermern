import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getMatchBets, reset } from '../features/matchesBet/matchesBetSlice';
import { getMatch } from '../features/matches/matchSlice';
import Spinner from '../components/Spinner';
import SingleMatch from '../components/SingleMatch';

const UserBetAnalysis = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { matchBets, isLoading, isError, message } = useSelector((state) => state.matchBets);
    const [matchesData, setMatchesData] = useState([]);

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

    if (isLoading) {
        return <Spinner />;
    }

    const getRelatedMatches = (matchBet) => {
      // Ensure matchBet.matches is an array
      const matchIds = Array.isArray(matchBet.matches) ? matchBet.matches : [];
      return matchesData.filter(match => matchIds.includes(match._id));
    };

    return (
        <>
            <Container style={{ marginTop: "80px" }}>
                <Row>
                    <Col xs={12}>
                        <h2>Analisi giocate</h2>
                        {matchBets.length > 0 ? matchBets.map((matchBet, index) => (
                            <div key={matchBet._id} className="p-3 mb-5 border border-light shadow-sm bg-white rounded">
                                <h4>Giocata {index + 1}</h4>
                                
                                {getRelatedMatches(matchBet).length > 0 ? (
                                    getRelatedMatches(matchBet).map((match, index) => (
                                        <div key={match._id} className={index !== getRelatedMatches(matchBet).length - 1 ? "border-bottom pb-3 mb-3" : "pb-3"} >
                                            <SingleMatch dateMatch={match.dateMatch} homeTeam={match.homeTeam} awayTeam={match.awayTeam} league={match.league} odds={match.odds} typeOfBet={match.typeOfBet} typeOfBet_choice={match.typeOfBet_choice}/>
                                        </div>
                                    ))
                                ) : (
                                    <h4>No match data available</h4>
                                )}
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
