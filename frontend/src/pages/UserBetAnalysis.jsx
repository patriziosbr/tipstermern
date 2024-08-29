import React, { Fragment, useEffect } from 'react';
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

const UserBetAnalysis = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { matchBets, isLoading, isError, message } = useSelector((state) => state.matchBets);
    
    useEffect(() => {
        if (isError) {
            console.log(message, "Error fetching match bets");
        }

        if (!user) {
            navigate('/login');
        } else {
            dispatch(getMatchBets());
        }

        return () => {
            dispatch(reset());
        };
    }, [user, navigate, isError, message, dispatch]);

    const deleteRealod = async (_id) => {
        try {
            await dispatch(deleteMatchesBet(_id)).unwrap(); // Wait for delete to complete
            dispatch(getMatchBets()); // Refetch the data
        } catch (error) {
            console.error("Error deleting match bet:", error);
        }
    }

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
                            let lastTipsterName = null; // Initialize a variable to track the last displayed tipster name
                            return (
                                <div key={_id} className="p-3 mb-5 border border-light shadow-sm bg-white rounded">
                                    {matches && matches.length > 0 ? (
                                        matches.map((match) => {
                                            const shouldDisplayTipsterName = lastTipsterName !== match.tipster.nameTips;
                                            if (shouldDisplayTipsterName) {

                                                lastTipsterName = match.tipster.nameTips; // Update the last displayed tipster name
                                            }
                                            return (
                                                <Fragment key={match._id}>
                                                    {/* {JSON.stringify(match.tipster.value.nameTips)} */}
                                                    <div className="border-bottom pb-3 mb-3">
                                                        {shouldDisplayTipsterName && (
                                                            <div className='d-flex justify-content-between'>
                                                                <p>Name: <b><i>{match.tipster.nameTips || match.tipster.value.nameTips}</i></b></p>
                                                                <span className='text-danger' style={{cursor: "pointer"}}><FaRegTrashAlt onClick={() => deleteRealod(_id)} /></span>
                                                            </div>
                                                        )}
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
            </Row>
        </Container>
    );
};

export default UserBetAnalysis; 
