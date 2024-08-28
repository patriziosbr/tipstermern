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
    
        dispatch(getMatchBets())
            .unwrap()
            .then((processedBets) => {
                setFilteredMatchesData(processedBets);
            })
            .catch(err => {
                console.error('Failed to fetch match data:', err);
            });
    
        return () => {
            dispatch(reset());
        };
    }, [user, navigate, isError, message, dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        
        <Container style={{ marginTop: "80px" }}>
            <Row>
                <Col xs={12}>
                    <h2>Analisi giocate</h2>
                    {filteredMatchesData.length > 0 ? (
                        filteredMatchesData.map(({ _id, relatedMatches, totalOdds, vincita, profitto }, index) => (
                            <div key={_id} className="p-3 mb-5 border border-light shadow-sm bg-white rounded">
                                {relatedMatches.length > 0 ? (
                                    relatedMatches.map((match) => (
                                        <Fragment key={match._id}>
                                            <div className="border-bottom pb-3 mb-3">
                                                <p>Name: <b><i>{match.tipster.value.nameTips}</i></b></p>
                                                <SingleMatch 
                                                    dateMatch={match.dateMatch} 
                                                    homeTeam={match.homeTeam} 
                                                    awayTeam={match.awayTeam} 
                                                    league={match.league} 
                                                    odds={match.odds} 
                                                    typeOfBet={match.typeOfBet} 
                                                    typeOfBet_choice={match.typeOfBet_choice} 
                                                />
                                            </div>
                                        </Fragment>
                                    ))
                                ) : (
                                    <h4>No match data available</h4>
                                )}
                                <div className='d-flex justify-content-end mb-3'>
                                    <div className='btn btn-primary px-4'>
                                        <small className='m-0'>Quota {totalOdds}</small>
                                    </div>
                                </div>
                                <ListGroup>
                                    <ListGroup.Item>Pagato: {betPaid}€</ListGroup.Item>
                                    <ListGroup.Item variant="light">Vincita: {vincita}€</ListGroup.Item>
                                    <ListGroup.Item>Profitto: {profitto}€</ListGroup.Item>
                                </ListGroup>
                            </div>
                        ))
                    ) : (
                        <h4>Non ci sono giocate</h4>
                    )}
                </Col>
            </Row>
        </Container>
    );
    
};

export default UserBetAnalysis;
