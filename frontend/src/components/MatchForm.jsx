import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMatch } from '../features/matches/matchSlice';
import { createMatchesBet } from '../features/matchesBet/matchesBetSlice';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaRegTrashAlt } from "react-icons/fa";

import { toast } from 'react-toastify'

const MatchForm = ({ aIText }) => {

  console.log(aIText ,"aIText");
  
  const [recognizedText, setRecognizedText] = useState(aIText);
  const [matchSplit, setMatchSplit] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({}); // erroe ONSUBMIT
  const [matchCount, setMatchCount] = useState(0);
  const handle = ({target:{value}}) => setRecognizedText(value)
  const [formBlocks, setFormBlocks] = useState([]);
  const dispatch = useDispatch();


  useEffect(() => {
    const initialState = matchSplit.reduce((acc, match, index) => {
      acc[`matchDate${index}`] = match.date || '';
      acc[`league${index}`] = match.league || '';
      acc[`homeTeam${index}`] = match.homeTeam || '';
      acc[`awayTeam${index}`] = match.awayTeam || '';
      acc[`typeOfBet${index}`] = match.typeOfBet || '';
      acc[`typeOfBet_choice${index}`] = match.typeOfBet_choice || '';
      acc[`odds${index}`] = match.odds || '';
      acc[`matchWin${index}`] = match.matchWin ?? 2;
      acc[`betPaid`] = match.betPaid || 1;
      return acc;
    }, {});
    setFormData(initialState);

  }, [matchSplit]);

  useEffect(() => {
    if(aIText){
      countMatches(aIText[0])
    }
   
  }, []);


  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const countMatches = (text) => {
    // const datePattern = /\d{2}\/\d{2}(?:\/\d{4})?\s\d{2}:\d{2}/g;
    // const leaguePattern = /-\s([\w\s]+(?:\s[\w\s]+)?)(?=\s-\s)/g;
    // const teamPattern = /-\s([\w\s]+)\s-\s([\w\s]+)/g;
    // const matches = text.match(datePattern) || [];
    // const leagues = [...text.matchAll(leaguePattern)].map(match => match[1].trim()) || [];
    // const teams = [...text.matchAll(teamPattern)] || [];
    // const totalMatches = Math.min(matches.length, leagues.length, teams.length);

    // const initialState = Array.from({ length: totalMatches }, (_, index) => ({
    //   [`matchDate${index}`]: formattedDate(matches[index]) || '',
    //   [`league${index}`]: leagues[index] || '',
    //   [`homeTeam${index}`]: teams[index][1].trim() || '',
    //   [`awayTeam${index}`]: teams[index][2].trim() || '',
    //   [`typeOfBet${index}`]: '',
    //   [`typeOfBet_choice${index}`]: '',
    //   [`odds${index}`]: '',
    //   [`matchWin${index}`]: 2,
    //   [`betPaid`]: 1
    // })).reduce((acc, match) => ({ ...acc, ...match }), {});

    // setFormData(initialState);
    // setFormBlocks(Array.from({ length: totalMatches }, (_, index) => ({ index })));
    // setMatchCount(totalMatches);
    // validateForm(initialState)
};
  
  const handleAddBlock = () => {
    setFormBlocks([...formBlocks, { index: formBlocks.length }]);
  };

  const deleteBlock = (matchIndex) => {
    // Remove the block
    setFormBlocks((prevBlocks) => {
      const updatedBlocks = prevBlocks.filter((_, index) => index !== matchIndex);

      // Clear values of the deleted block from formData
      const updatedFormData = { ...formData };
      Object.keys(formData).forEach(key => {
        if (key.endsWith(`${matchIndex}`)) {
          delete updatedFormData[key];
        }
      });

      setFormData(updatedFormData); // Update formData state

      // Update indices of remaining blocks
      return updatedBlocks.map((block, index) => ({
        ...block,
        index: index, // Ensure the index is sequential
      }));
    });
  };

  const formattedDate = (dateStr)=>{
    const [day, month , year] = dateStr.split(" ")[0].split("/");
    const time = dateStr.split(" ")[1];
    let formattedDate = "";

    if(year) {
      formattedDate = `${year}-${month}-${day}T${time}:00`
    } else {
      const currentYear = new Date().getFullYear();
      formattedDate = `${currentYear}-${month}-${day}T${time}:00`
    }
    
    return formattedDate
  }

  const validateForm = (data) => {
    let errors = {};

    // Handle case where `data` is empty
    if (Object.keys(data).length === 0) {
      // Create errors for each block
      for (let index = 0; index < formBlocks.length; index++) {
        errors[`matchDate${index}`] = "matchDate is required";
        errors[`homeTeam${index}`] = "homeTeam is required";
        errors[`awayTeam${index}`] = "awayTeam is required";
        errors[`typeOfBet${index}`] = "typeOfBet is required";
        errors[`typeOfBet_choice${index}`] = "typeOfBet_choice is required";
        errors[`odds${index}`] = "odds is required";
        errors[`betPaid`] = "odds is required";
        
      }
      setErrors(errors);
      return errors;
    }

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        console.log(key, "key");
        console.log(element, "val");

        if (typeof element === "string" && !element.trim()) {
          console.log(`${key} is empty, marking as error`);
          errors[key] = `${key} is required`;
      }
        // if (!element.trim()) {
        //   errors[key] = `${key} is required`;
        // }
      } else {
        console.error("Error in validateForm");
      }
    }
    setErrors(errors)
    
    return errors;
  };

  const filteredOptions = [
    { value: { nameTips: "Tipster1", id: "1" }, option: "Tipster1" },
    { value: { nameTips: "Tipster2", id: "2" }, option: "Tipster2" },
    { value: { nameTips: "Tipster3", id: "3" }, option: "Tipster3" }
  ];
  

  let renderOptions = () => {
    return filteredOptions.map((option, index) => {
      return (
        <option key={index} value={option.value.nameTips}>
          {option.option}
        </option>
      );
    });
  };


  const onSubmit = async (e) => {
    e.preventDefault()
    // console.log( formData, "formData");
    const newErrors = validateForm(formData);
    console.log(newErrors, "newErrors");
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      toast.success('Form submitted successfully!');
    } else {
      toast.error("Form submission failed due to validation errors.");
      return
    }
    
    const matchesArray = [];
    const totalMatches = Object.keys(formData).length / 11; // 11 fields per match

    for (let i = 0; i < totalMatches; i++) {
      // Find the corresponding tipster object
      const tipsterOption = formData[`tipster${i}`];
      const tipsterObject = filteredOptions.find(option => option.value.nameTips === tipsterOption);

      matchesArray.push({
        matchDate: formData[`matchDate${i}`],
        league: formData[`league${i}`],
        homeTeam: formData[`homeTeam${i}`],
        awayTeam: formData[`awayTeam${i}`],
        typeOfBet: formData[`typeOfBet${i}`],
        typeOfBet_choice: formData[`typeOfBet_choice${i}`],
        odds: formData[`odds${i}`],
        tipster: tipsterObject ? tipsterObject.value : {value: { nameTips: formData[`tipster${i}`], id: "" }, option: formData[`tipster${i}`]},
        matchWin: formData[`matchWin${i}`] ?? 2,
        recognizedText : recognizedText,
        betPaid: formData[`betPaid`]
      });
    }
    // console.log('matchesArray matchesArray matchesArray:', matchesArray);
    
    let matchesBetData = {};
    let matchesID = [];
    let matchesWinLoss = [];
    let totalOdds = [];
    await dispatch(createMatch( matchesArray )).then((result)=>{
      // console.log(result, "result");
      result.payload.map((single) => {
        matchesID.push(single._id);
        matchesWinLoss.push(single.matchWin);
        totalOdds.push(single.odds)
//refactor oggetto matchesBetData sotto
        if(matchesWinLoss.includes(0)){
          matchesBetData = {matches: matchesID, isWin: 0}
        } else if (matchesWinLoss.includes(2) || matchesWinLoss.includes(null) || matchesWinLoss.includes(undefined)) {
          matchesBetData = {matches: matchesID, isWin: null}
        } else {
          matchesBetData = {matches: matchesID, isWin: true}
        }
      })
    }).catch(function(error) {
      console.error("error", error)
      return
    })

    const totalOddsRes = totalOdds.reduce((prev, next, index) => prev * next )
    // console.log(totalOddsRes, "totalOddsRes");
    
    matchesBetData.totalOdds = totalOddsRes
    matchesBetData.betPaid = formData[`betPaid`]

    await dispatch(createMatchesBet( matchesBetData )).then((result)=>{
      // console.log(result, "result2");
      // toast.success(result.meta.requestStatus)
    })
  }

  return (
    <div>
      {/* <Form className="mb-3" onSubmit={onSubmit}>
       {recognizedText && 
       <>
        <h6>Match found: {matchCount}</h6>
        <Form.Group className="mb-3" controlId={`test`}>
          <Form.Label className=''>Recognized Text:</Form.Label>
          <Form.Control as="textarea" rows={10} value={recognizedText} name={`recognizedText`} onChange={handle}/>
        </Form.Group>
       </>}

      <Button onClick={handleAddBlock}>Add Giocata</Button>
      {formBlocks && formBlocks.map((block) => (
        <div key={block.index}>
          <h6>Giocata: {block.index + 1} <span className='text-danger'><FaRegTrashAlt onClick={()=>deleteBlock(block.index)} /></span></h6>
          <Form.Group className="mb-3" style={{ width: '100%' }}>
            <Form.Label>Tipster</Form.Label>
            <Form.Control
              type="text"
              name={`tipster${block.index}`}
              value={formData[`tipster${block.index}`] || ''}
              onChange={onChange}
              className={ errors[`tipster${block.index}`] ? 'border-danger' : "" } 
              list={`tipster${block.index}`}
            />
            <datalist id={`tipster${block.index}`}>{renderOptions()}</datalist>
          </Form.Group>
          <div style={{ display: 'flex' }}>
            <Form.Group className="mb-3 me-2" controlId={`formBasicEmail${block.index}`} style={{ width: '50%' }}>
              <Form.Label>Giorno evento</Form.Label>
              <Form.Control
                type="datetime-local"
                name={`matchDate${block.index}`}
                value={formData[`matchDate${block.index}`] || ''}
                onChange={onChange}
                className={ errors[`matchDate${block.index}`] ? 'border-danger' : "" }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId={`formBasicEmail${block.index}`} style={{ width: '50%' }}>
              <Form.Label>Leaga</Form.Label>
              <Form.Control
                type="text"
                name={`league${block.index}`}
                value={formData[`league${block.index}`] || ''}
                onChange={onChange}
                className={ errors[`league${block.index}`] ? 'border-danger' : "" }
              />
            </Form.Group>
          </div>
          <div style={{ display: 'flex' }}>
            <Form.Group className="mb-3 me-2" controlId={`formBasicEmail${block.index}`} style={{ width: '50%' }}>
              <Form.Label>Home Team</Form.Label>
              <Form.Control
                type="text"
                name={`homeTeam${block.index}`}
                value={formData[`homeTeam${block.index}`] || ''}
                onChange={onChange}
                className={ errors[`homeTeam${block.index}`] ? 'border-danger' : "" }
                
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId={`formBasicEmail${block.index}`} style={{ width: '50%' }}>
              <Form.Label>Away Team</Form.Label>
              <Form.Control
                type="text"
                name={`awayTeam${block.index}`}
                value={formData[`awayTeam${block.index}`] || ''}
                onChange={onChange}
                className={ errors[`awayTeam${block.index}`] ? 'border-danger' : "" }
              />
            </Form.Group>
          </div>
          <div style={{ display: 'flex' }}>
            <Form.Group className="mb-3 me-2" controlId={`formBasicEmail${block.index}`} style={{ width: '50%' }}>
              <Form.Label>Type of Bet</Form.Label>
              <Form.Control
                type="text"
                name={`typeOfBet${block.index}`}
                value={formData[`typeOfBet${block.index}`] || ''}
                onChange={onChange}
                className={ errors[`typeOfBet${block.index}`] ? 'border-danger' : "" } 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId={`formBasicEmail${block.index}`} style={{ width: '50%' }}>
              <Form.Label>Type of Bet Choice</Form.Label>
              <Form.Control
                type="text"
                name={`typeOfBet_choice${block.index}`}
                value={formData[`typeOfBet_choice${block.index}`] || ''}
                onChange={onChange}
                className={ errors[`typeOfBet_choice${block.index}`] ? 'border-danger' : "" } 
              />
            </Form.Group>
          </div>
          <Form.Group className="mb-3" controlId={`formBasicEmail${block.index}`} style={{ width: '100%' }}>
            <Form.Label>Odds</Form.Label>
            <Form.Control
              type="text"
              name={`odds${block.index}`}
              value={formData[`odds${block.index}`] || ''}
              onChange={onChange}
              className={ errors[`odds${block.index}`] ? 'border-danger' : "" } 
            />
          </Form.Group>
          <div>
          <Form.Label>Win or Loss</Form.Label>
            <div style={{ display: 'flex' }}>
              <Form.Group className="mb-3" controlId={`formBasicEmail${block.index}`} style={{ width: '33%' }}>
                <Form.Check
                  type="radio"
                  label="Si"
                  id={`matchWin${block.index}`}
                  name={`matchWin${block.index}`}
                  onChange={onChange}
                  value={1}
                  />
              </Form.Group>
              <Form.Group className="mb-3" controlId={`formBasicEmail${block.index}`} style={{ width: '33%' }}>
                <Form.Check
                  type="radio"
                  label="No"
                  id={`matchWin${block.index}`}
                  name={`matchWin${block.index}`}
                  onChange={onChange}
                  value={0}
                  />
              </Form.Group>
              <Form.Group className="mb-3" controlId={`formBasicEmail${block.index}`} style={{ width: '33%' }}>
                <Form.Check
                  type="radio"
                  label="Null"
                  id={`matchWin${block.index}`}
                  name={`matchWin${block.index}`}
                  onChange={onChange}
                  value={2}
                  defaultChecked={formData[`matchWin${block.index}`] === 2}
                  />
              </Form.Group>
            </div>
        </div>
      </div>
      ))}
      {formBlocks.length > 0 &&
        <>
          <div>
          <Form.Group className="mb-3" controlId={`formBasicEmail`} style={{ width: '100%' }}>
            <Form.Label>Importo</Form.Label>
            <Form.Control
              type="number"
              min={0}
              max={9999}
              name={`betPaid`}
              value={formData[`betPaid`] || ''}
              onChange={onChange}
              className={ errors[`betPaid`] ? 'border-danger' : "" } 
            />
          </Form.Group>
          </div>
          <Button variant="primary" type="submit" style={{ width: "100%" }}>
            Submit
          </Button>
        </>
      }
      </Form> */}
      </div>



        

  );
};

export default MatchForm;