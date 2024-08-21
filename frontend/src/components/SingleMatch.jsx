import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import { getMatchesBet, reset } from '../features/matchesBet/matchesBetSlice';
import { getMatch, reset  } from '../features/matches/matchSlice';
import Spinner from '../components/Spinner';

const SingleMatch = () => {
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


    return (
        <>
            <Container style={{ marginTop: "80px" }}>
                <Row>
                    <Col xs={12}>
                    {matches.map(match => (
                        <div key={match._id}>
                            <h2>{match.awayTeam}</h2>
                            <h2>{match.homeTeam}</h2>
                        </div>
                    ))}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default SingleMatch;
