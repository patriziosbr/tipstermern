import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getMatchesBet, reset } from '../features/matchesBet/matchesBetSlice';
import { getMatch } from '../features/matches/matchSlice';
import Spinner from '../components/Spinner';

const TipsterAnalysis = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const { matchBets, isLoading, isError, message } = useSelector(
      (state) => state.matchBets  
    )
    const { matches } = useSelector(
      (state) => state.matches
    )

    useEffect(() => {
        if (isError) {
          console.log(message, "message")
        }
    
        if (!user) {
          navigate('/login')
        }
    
        dispatch(getMatchesBet())
        dispatch(getMatch())
    
        return () => {
          dispatch(reset())
        }
      }, [user, navigate, isError, message, dispatch])

    if (isLoading) {
        return <Spinner />
    }
    return (
    <>
    {console.log(matches, "matches")}
    {console.log(matchBets, "matchBets")}
            <Container style={{marginTop: "80px"}}>
                <Row>
                    <Col xs={12}>
                        <h2>TipsterAnalysis</h2>
                        {matchBets ? matchBets.map((matchBet) => (
                        <div key={matchBets._id}>
                           {JSON.stringify(matchBets)}
                        </div>
                        )):
                        <h4> Non ci sono eventi </h4>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
};
export default TipsterAnalysis;
