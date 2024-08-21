import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getMatchBets, reset } from '../features/matchesBet/matchesBetSlice';
import { getMatch } from '../features/matches/matchSlice';
import Spinner from '../components/Spinner';

const TipsterAnalysis = () => {
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
            {console.log(matchBets, "matchBets")}
            {console.log(matchesData, "matchesData")}
            <Container style={{ marginTop: "80px" }}>
                <Row>
                    <Col xs={12}>
                        <h2>Analisi giocate</h2>
                        {matchBets.length > 0 ? matchBets.map((matchBet, index) => (
                            <div key={matchBet._id}>
                                <h4>Giocata {index + 1}</h4>
                                {getRelatedMatches(matchBet).length > 0 ? (
                                    getRelatedMatches(matchBet).map((match) => (
                                        <div key={match._id}>
                                            <p><strong>Match ID:</strong> {match._id}</p>
                                            <p><strong>Date:</strong> {match.dateMatch}</p>
                                            <p><strong>Home Team:</strong> {match.homeTeam}</p>
                                            <p><strong>Away Team:</strong> {match.awayTeam}</p>
                                            <p><strong>League:</strong> {match.league}</p>
                                            <p><strong>Odds:</strong> {match.odds}</p>
                                            <p><strong>Type of Bet:</strong> {match.typeOfBet}</p>
                                            <p><strong>Bet Choice:</strong> {match.typeOfBet_choice}</p>
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

export default TipsterAnalysis;
