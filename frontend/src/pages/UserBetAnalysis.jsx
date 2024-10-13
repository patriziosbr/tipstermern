import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import {
  getMatchBets,
  deleteMatchesBet,
  reset,
} from "../features/matchesBet/matchesBetSlice";
import { updateMatch } from "../features/matches/matchSlice";
import Spinner from "../components/Spinner";
import SingleMatch from "../components/SingleMatch";
import { FaRegTrashAlt } from "react-icons/fa";
import { AiOutlineEdit } from 'react-icons/ai'
import { toast } from "react-toastify";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import Modal from 'react-bootstrap/Modal';
import MatchFormManualEdit from '../components/MatchFormManualEdit'
import CarouselContainer from '../components/CarouselContainer'


const UserBetAnalysis = () => {
  // modal
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false); // Optionally reset the ID on close
  };
  const handleShow = (id) => {
    console.log(id, "pippo");
    console.log(matchBets, "matchBets");
     
    const selectedBET = matchBets.find((bet) => bet._id === id);
    console.log(selectedBET, "selectedBET");
    
    if (selectedBET) {
      setSelectedBetEdit(selectedBET);
      setShow(true);
    }
  };
  const [selectedBetEdit, setSelectedBetEdit] = useState([]);
  // redux
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [singleMatch, setSingleMatch] = useState([]);
  const [responseMatches, setResponseMatches] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { matchBets, isLoading, isError, message } = useSelector(
    (state) => state.matchBets
  );

  useEffect(() => {
    if (isError) {
      console.log(message, "Error fetching match bets");
    }

    if (!user) {
      navigate("/login");
    } else {
      const fetchBets = async () => {
        try {
          const matchBets = await dispatch(getMatchBets()).unwrap();

          // Accumulate matches in a nested array structure
          const allMatches = matchBets.flatMap((single) => single.matches);
          setSingleMatch(allMatches);
        } catch (error) {
          console.error("Failed to fetch match bets:", error);
        }
      };
      fetchBets();
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const [singleIDMatch, setSingleIDMatch] = useState("");
  const getMatchStats = async (date, homeTeam, awayTeam, matchID) => {
    // console.log(matchID, "matchID");
    setSingleIDMatch(matchID);
    await callRapidApi(date.split("T")[0], homeTeam, awayTeam);
  };

  useEffect(() => {
    // console.log(responseMatches, "responseMatches1 responseMatches1");
  }, [responseMatches]);

  const callRapidApi = (date, homeTeam, awayTeam) => {
    setStatByEventIDResult([])
    setFilteredData([])
    setMatchName('');
    setUniquePeriod([])
    setSummaryInfos([])
    const data = JSON.stringify({});

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        try {
          const responseJson = JSON.parse(this.responseText);
          setResponseMatches(responseJson);
          console.log(responseJson, "Parsed response prima chiamta");
        } catch (error) {
          console.error("Error parsing response:", error);
          setResponseMatches(null); // or handle the error as appropriate
        }
      }
    });

    xhr.open(
      "POST",
      `https://sportscore1.p.rapidapi.com/events/search-similar-name?date=${date}&page=1&locale=en&sport_id=1&name=${homeTeam}%20-%20${awayTeam}`
    );
    xhr.setRequestHeader("x-rapidapi-key", process.env.REACT_APP_NODE_RAPID);
    xhr.setRequestHeader("x-rapidapi-host", "sportscore1.p.rapidapi.com");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
  };
  
  const [statByEventIDResult, setStatByEventIDResult] = useState([]);
  const [uniquePeriod, setUniquePeriod] = useState([]);
  const [matchName, setMatchName] = useState("");
  const [summaryInfos, setSummaryInfos] = useState([]);
  const statByEventID = (eventId, matchName) => {
    setFilteredData([])
    const data = JSON.stringify({});

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        const responseJson = JSON.parse(this.responseText);
        // console.log(responseJson, "Parsed response");
        setStatByEventIDResult(responseJson.data);
        
        setFilteredData(responseJson.data.filter(item => item.period === "all"))
        setSelected("all");
        const unique = [...new Set(responseJson.data.map(item => item.period))];
        setUniquePeriod(unique)
        
        setMatchName(matchName);
        console.log(responseMatches, "responseMatches");
        
        const overAllInfo = responseMatches.data.filter((match) => match.id === eventId);
        console.log(overAllInfo, "overAllInfo");

        let filters = ['away_score', 'home_score', 'status', 'winner_code'];
        const filterJSON = (obj, fil) => fil.reduce((a, c) => (a[c] = obj[c], a), {});
        
        let summaryInfosTemp = [];
        overAllInfo.forEach((single) => {
          summaryInfosTemp.push(filterJSON(single, filters));
        });
        
        // Set the filtered information after the loop
        setSummaryInfos(summaryInfosTemp);

        }
    });

    xhr.open(
      "GET",
      `https://sportscore1.p.rapidapi.com/events/${eventId}/statistics`
    );
    xhr.setRequestHeader("x-rapidapi-key", process.env.REACT_APP_NODE_RAPID);
    xhr.setRequestHeader("x-rapidapi-host", "sportscore1.p.rapidapi.com");

    xhr.send(data);

  };

  const renderScore = (info, selected) => {
    if (selected === "1st") {
      return (
        <p class="m-0">Score 1st time: <b>{info.home_score.period_1}:{info.away_score.period_1}</b></p>
      );
    } else if (selected === "2nd") {
      return (
        <p class="m-0">Score 2nd time: <b>{info.home_score.period_2}:{info.away_score.period_2}</b></p>
      );
    } else {
      return (
        <>
          <p class="m-0">Score Final: <b>{info.home_score.current}:{info.away_score.current}</b></p>
        </>
      );
    }
  };

  const [filteredData, setFilteredData] = useState([]); // New state to hold the filtered data
  const [selected, setSelected] = useState("");

  const selectedPeriod = (period) => {
    setSelected(period); 
    if (period === "all") {
      setFilteredData(statByEventIDResult.filter(item => item.period === "all"));  // Show all data
    } else if (period === "1st") {
      setFilteredData(statByEventIDResult.filter(item => item.period === "1st"));  // Filter by "1st" period
    } else if (period === "2nd") {
      setFilteredData(statByEventIDResult.filter(item => item.period === "2nd"));  // Filter by "2nd" period
    }
  };

  const deleteRealod = async (_id) => {
    try {
      await dispatch(deleteMatchesBet(_id)).unwrap(); // Wait for delete to complete
      // dispatch(getMatchBets()); // Refetch the data
      toast.success("match eliminato con succcesso");
    } catch (error) {
      toast.error("Errore: " + error);
      console.error("Error deleting match bet:", error);
    }
  };

  const updateMatchbtn = async (_id, updateParam) => {
    console.log(_id, updateParam);
    let data = { matchId: _id, body: updateParam };
    try {
      await dispatch(updateMatch(data)); // Wait for delete to complete
      dispatch(getMatchBets());
      toast.success("match aggiornato con succcesso");
    } catch (error) {
      toast.error("Errore: " + error);
      console.error("Error deleting match bet:", error);
    }
  };



  if (isLoading) {
    return <Spinner />;
  }


  return (
    <>
    {console.log(summaryInfos, "summary")}
    
    <Container style={{ marginTop: "80px" }}>
      <Row>
          <Col xs={12} md={6}>
            <h2>Analisi giocate</h2>
          </Col>
      </Row>
      <Row>
        <Col xs={12} md={12}>
        <CarouselContainer/>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          {matchBets && matchBets.length > 0 ? (
            matchBets.map(
              (
                { _id, matches, totalOdds, betPaid, totalWin, profit },
                index
              ) => {
                return (
                  <div
                    key={_id}
                    className="p-3 mb-5 border border-light shadow-sm bg-white rounded"
                  >
                    {matches && matches.length > 0 ? (
                      matches.map((match, matchIndex) => {
                        return (
                          <Fragment key={match._id}>
                            {/* {JSON.stringify(match.tipster)} */}
                            <div className="border-bottom pb-3 mb-3">
                              <div className="d-flex justify-content-between">
                                {matchIndex === 0 && (
                                  <>
                                    { match.tipster?.value.nameTips ? (
                                    <p> 
                                      Tipster Name: <b><i>{match.tipster?.value.nameTips}</i></b>
                                    </p> ) : (<p></p>) 
                                     }

                                    <div className="d-flex">
                                      <span
                                        onClick={() => handleShow(_id)}
                                        className="d-flex"
                                        style={{ cursor: "pointer", height: "45px", width: "45px", border: "1px solid black"  }}
                                        >
                                        <AiOutlineEdit className='m-auto' />
                                      </span>
                                      <span
                                        className="text-danger d-flex"
                                        style={{ cursor: "pointer", height: "45px", width: "45px", border: "1px solid black"  }}
                                        onClick={() => deleteRealod(_id)}
                                        >
                                        <FaRegTrashAlt
                                          className='m-auto'  
                                        />
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                              <SingleMatch
                                matchID={match._id}
                                dateMatch={match.dateMatch}
                                homeTeam={match.homeTeam}
                                awayTeam={match.awayTeam}
                                league={match.league}
                                odds={match.odds}
                                typeOfBet={match.typeOfBet}
                                typeOfBet_choice={match.typeOfBet_choice}
                                matchWin={match.matchWin}
                                settermatchstats={getMatchStats}
                              />
                              {/* <Stack direction="horizontal" gap={2}>
                                                                <Badge pill className='ms-4 mt-2 p-2 border border-secondary text-secondary' bg="light" style={{cursor: "pointer"}} onClick={() => getMatchStats(match.dateMatch, match.homeTeam, match.awayTeam )}>
                                                                    Statistiche
                                                                </Badge>
                                                            </Stack> */}
                              <div className="d-flex">
                                <Stack direction="horizontal" gap={2}>
                                  <Badge
                                    pill
                                    className="ms-4 mt-2 p-2 border border-danger text-danger"
                                    bg="light"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      updateMatchbtn(match._id, { matchWin: 0 })
                                    }
                                  >
                                    Persa
                                  </Badge>
                                </Stack>
                                <Stack direction="horizontal" gap={2}>
                                  <Badge
                                    pill
                                    className="ms-4 mt-2 p-2 border border-warning text-warning"
                                    bg="light"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      updateMatchbtn(match._id, { matchWin: 2 })
                                    }
                                  >
                                    Annulata
                                  </Badge>
                                </Stack>
                                <Stack direction="horizontal" gap={2}>
                                  <Badge
                                    pill
                                    className="ms-4 mt-2 p-2 border border-success text-success"
                                    bg="light"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      updateMatchbtn(match._id, { matchWin: 1 })
                                    }
                                  >
                                    Vinta
                                  </Badge>
                                </Stack>
                              </div>
                              <div className="d-sm-block d-md-none">
                                <ul>
                                  {statByEventIDResult.length > 0 ? (
                                    // Render JSON string if `statByEventIDResult` has data
                                    <li>
                                      {JSON.stringify(statByEventIDResult)}
                                    </li>
                                  ) : (
                                    // If `statByEventIDResult` is empty, conditionally render based on `singleIDMatch === match._id`
                                    singleIDMatch === match._id &&
                                    responseMatches.data &&
                                    responseMatches.data.map((singleMatch) => (
                                      <li key={singleMatch.id}>
                                        {singleMatch.name} -{" "}
                                        <a
                                          href="#"
                                          onClick={() =>
                                            statByEventID(singleMatch.id, singleMatch.name)
                                          }
                                        >
                                          {singleMatch.id}
                                        </a>
                                      </li>
                                    ))
                                  )}
                                </ul>
                              </div>
                            </div>
                          </Fragment>
                        );
                      })
                    ) : (
                      <h4>No match data available</h4>
                    )}
                    <div className="d-flex justify-content-end mb-3">
                      <div className="btn btn-primary px-4">
                        <small className="m-0">
                          Quota {totalOdds?.toFixed(2)}
                        </small>
                      </div>
                    </div>
                    <ListGroup>
                      <ListGroup.Item>
                        Pagato: {betPaid.toFixed(2)}€
                      </ListGroup.Item>
                      <ListGroup.Item variant="light">
                        Vincita: {totalWin.toFixed(2)}€
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Profitto: {profit?.toFixed(2)}€
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                );
              }
            )
          ) : (
            <h4>Non ci sono giocate</h4>
          )}
        </Col>
        <Col sm={6} className="d-none d-sm-block">
<h5>{matchName}</h5>
{summaryInfos && summaryInfos.map((info, index) => (
  <div key={index}>
    {renderScore(info, selected)}
    <p class="m-0">Status: <b>{info.status}</b></p>
    <p class="m-0">Winner: <b>{info.winner_code}</b></p>
  </div>
))}

<div className="d-flex">
    {uniquePeriod && uniquePeriod.map((period, index) => (
      <Stack direction="horizontal" key={index+index}>
        <Badge
          pill
          className={`${index === 0 ? "ms-0" : "ms-4"} mt-2 p-2 border border-secondary text-secondary ${selected === period ? "border-2 fw-bolder fst-italic" : ""}`}
          bg="light"
          style={{ cursor: "pointer", width: "75px" }}
          onClick={() => selectedPeriod(period)}
        >
          {period}
        </Badge>
      </Stack>
    ))}
  </div>
  <ul>
    {filteredData && filteredData.length > 0 ? (
      filteredData.map((stats, index) => (
        <li key={index}>
          {stats.home} - {stats.name} - {stats.away}
        </li>
      ))
    ) : (
      responseMatches.data && responseMatches.data.map((singleMatch) => (
        <>
        <li key={singleMatch.id}>
          {singleMatch.name} -{" "}
          <a href="#" onClick={() => statByEventID(singleMatch.id, singleMatch.name)}>
            {singleMatch.id}
          </a>
        </li>
        </>
      ))
    )}
  </ul>
</Col>

      </Row>

    </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>Modifica:</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBetEdit ? (
            <>
              {/* <p><b>Home Team:</b> {selectedMatchEdit.homeTeam}</p>
              <p><b>Away Team:</b> {selectedMatchEdit.awayTeam}</p>
              <p><b>Date:</b> {new Date(selectedMatchEdit.dateMatch).toLocaleDateString()}</p> */}
              {/* {console.log("selectedBetEdit", selectedBetEdit)} */}
              <MatchFormManualEdit selectedBetEdit={selectedBetEdit} />
            </>
          ) : (
            <p>No match selected</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserBetAnalysis;
