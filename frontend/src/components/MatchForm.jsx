import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { useDispatch } from 'react-redux';
import { createMatch } from '../features/matches/matchSlice';
import { createMatchesBet } from '../features/matchesBet/matchedBetSlice';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaRegTrashAlt } from "react-icons/fa";
import {retext} from 'retext';
import pos from 'retext-pos';
import keywords from 'retext-keywords';
import {toString} from 'nlcst-to-string';

const MatchForm = ({ selectedImage, keyWordAndPhrases }) => {
  const [recognizedText, setRecognizedText] = useState('');
  const [matchSplit, setMatchSplit] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({}); // erroe ONSUBMIT
  const [keywordsList, setKeywordsList] = useState([]);
  const [keyPhrasesList, setKeyPhrasesList] = useState([]);
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
      return acc;
    }, {});
    setFormData(initialState);

  }, [matchSplit]);

  useEffect(() => {
    const recognizeText = async () => {
      if (selectedImage) {
        const { data: { text } } = await Tesseract.recognize(selectedImage, 'eng');
        setRecognizedText(text);
        // textHandler(text); // x passare text nel padre
        processText(text);
        countMatches(text)
      }
    };   
    recognizeText();
   
  }, [selectedImage]);

  const onChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const countMatches = (text) => {
    const datePattern = /\d{2}\/\d{2}(?:\/\d{4})?\s\d{2}:\d{2}/g;
    const leaguePattern = /-\s([\w\s]+(?:\s[\w\s]+)?)(?=\s-\s)/g;
    const teamPattern = /-\s([\w\s]+)\s-\s([\w\s]+)/g;
    const matches = text.match(datePattern) || [];
    const leagues = [...text.matchAll(leaguePattern)].map(match => match[1].trim()) || [];
    const teams = [...text.matchAll(teamPattern)] || [];
    const totalMatches = Math.min(matches.length, leagues.length, teams.length);

    const initialState = Array.from({ length: totalMatches }, (_, index) => ({
      [`matchDate${index}`]: formattedDate(matches[index]) || '',
      [`league${index}`]: leagues[index] || '',
      [`homeTeam${index}`]: teams[index][1].trim() || '',
      [`awayTeam${index}`]: teams[index][2].trim() || '',
      [`typeOfBet${index}`]: '',
      [`typeOfBet_choice${index}`]: '',
      [`odds${index}`]: '',
    })).reduce((acc, match) => ({ ...acc, ...match }), {});

    setFormData(initialState);
    setFormBlocks(Array.from({ length: totalMatches }, (_, index) => ({ index })));
    setMatchCount(totalMatches);
};
  
  const processText = (text) => {
    retext()
      .use(pos) // Part-of-speech tagging
      .use(keywords) // Keyword and key-phrase extraction
      .process(text, (err, file) => {
        if (err) throw err;
        const extractedKeywords = file.data.keywords.map((keyword) =>
          toString(keyword.matches[0].node)
        );
        const extractedKeyPhrases = file.data.keyphrases.map((phrase) =>
          phrase.matches[0].nodes.map((node) => toString(node)).join('')
        );
        setKeywordsList(extractedKeywords);
        setKeyPhrasesList(extractedKeyPhrases);
        keyWordAndPhrases([...extractedKeywords, ...extractedKeyPhrases])
      });
  };

  const handleAddBlock = () => {
    setFormBlocks([...formBlocks, { index: formBlocks.length }]);
  };

  const deleteBlock = (matchIndex) => {
    setFormBlocks((prevBlocks) => {
      const updatedBlocks = prevBlocks.filter((_, index) => index !== matchIndex);

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
    const errors = {};
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        // console.log(key, "key");
        // console.log(element, "val");
        if (!element.trim()) {
          errors[key] = `${key} is required`;
        }
      }
    }
    setErrors(errors)
    
    return errors;
};


  const onSubmit = async (e) => {
    e.preventDefault()
    console.log( formData, "formData");
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted successfully!');
    } else {
      console.log('Form submission failed due to validation errors.');
    }
    
    const matchesArray = [];
    const totalMatches = Object.keys(formData).length / 7; // 7 fields per match
    
    for (let i = 0; i < totalMatches; i++) {
      matchesArray.push({
        matchDate: formData[`matchDate${i}`],
        league: formData[`league${i}`],
        homeTeam: formData[`homeTeam${i}`],
        awayTeam: formData[`awayTeam${i}`],
        typeOfBet: formData[`typeOfBet${i}`],
        typeOfBet_choice: formData[`typeOfBet_choice${i}`],
        odds: formData[`odds${i}`],
        tipster: null,
        matchWin: null,
        recognizedText : recognizedText, 
      });
    }
    console.log('matchesArray matchesArray matchesArray:', matchesArray);
       
    let matchesID = [];
    await dispatch(createMatch( matchesArray )).then((result)=>{
      console.log(result, "result");
      result.payload.map((single) => {
        matchesID.push(single._id)
      })
    })

    await dispatch(createMatchesBet( matchesID )).then((result)=>{
      console.log(result, "result2");
    })
  }

  return (
    <div>
      <Form className="mb-3" onSubmit={onSubmit}>
       {matchCount > 0 && 
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
          
        </div>
      ))}
      {formBlocks.length > 0 &&
          <Button variant="primary" type="submit" style={{ width: "100%" }}>
            Submit
          </Button>
      }
      </Form>
      </div>



        

  );
};

export default MatchForm;