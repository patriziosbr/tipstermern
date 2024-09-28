import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createMatch } from '../features/matches/matchSlice';
import { createMatchesBet } from '../features/matchesBet/matchesBetSlice';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify';

const MatchFormManualEdit = ({ selectedBetEdit }) => {
  const [formData, setFormData] = useState([]);
  const [errors, setErrors] = useState({});
  const [formBlocks, setFormBlocks] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedBetEdit) {
      const selectedMatchEditTemp = selectedBetEdit;
  
      // Create a new array to store updated matches
      const updatedMatches = selectedMatchEditTemp.matches.map((single, index) => {
        const updatedSingle = {};
  
        // Iterate over the keys of each match
        Object.keys(single).forEach((key) => {
          // Update the key if it's not one of the excluded ones
          if (key !== "_id" && key !== "user" && key !== "_v" && key !== "createdAt" && key !== "updatedAt") {
            const newKey = key + index;
            updatedSingle[newKey] = single[key]; // Assign the value to the new key
          } else {
            // Keep the original key-value pair for excluded keys
            updatedSingle[key] = single[key];
          }
        });
  
        return updatedSingle; // Return the updated match object
      });
      console.log(updatedMatches.length, "updatedMatches");
      
      // Update the formData and formBlocks state with the modified matches
      setFormData(updatedMatches);
      setFormBlocks(updatedMatches);
    }
  }, [selectedBetEdit]);

  console.log(formData ,"what");
  

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const deleteBlock = (matchIndex) => {
    setFormBlocks((prevBlocks) => {
      const updatedBlocks = prevBlocks.filter((_, index) => index !== matchIndex);

      const updatedFormData = { ...formData };
      Object.keys(formData).forEach(key => {
        if (key.endsWith(`${matchIndex}`)) {
          delete updatedFormData[key];
        }
      });

      setFormData(updatedFormData);
      return updatedBlocks.map((block, index) => ({ ...block, index }));
    });
  };

  const validateForm = (data) => {
    let errors = {};
    if (Object.keys(data).length === 0) {
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
      if (typeof data[key] === "string" && !data[key].trim()) {
        errors[key] = `${key} is required`;
      }
    }
    setErrors(errors);
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
    e.preventDefault();
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Form submission failed due to validation errors.");
      return;
    }

    const matchesArray = [];
    const totalMatches = Object.keys(formData).length / 11;

    for (let i = 0; i < totalMatches; i++) {
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
        tipster: tipsterObject || { value: { nameTips: formData[`tipster${i}`], id: "" }, option: formData[`tipster${i}`] },
        matchWin: formData[`matchWin${i}`] ?? 2,
        betPaid: formData[`betPaid`]
      });
    }

    let matchesBetData = {};
    let matchesID = [];
    let matchesWinLoss = [];
    let totalOdds = [];
    await dispatch(createMatch(matchesArray)).then((result) => {
      result.payload.forEach(single => {
        matchesID.push(single._id);
        matchesWinLoss.push(single.matchWin);
        totalOdds.push(single.odds);

        if (matchesWinLoss.includes(0)) {
          matchesBetData = { matches: matchesID, isWin: 0 };
        } else if (matchesWinLoss.includes(2)) {
          matchesBetData = { matches: matchesID, isWin: null };
        } else {
          matchesBetData = { matches: matchesID, isWin: true };
        }
      });
    });

    const totalOddsRes = totalOdds.reduce((prev, next) => prev * next);
    matchesBetData.totalOdds = totalOddsRes;
    matchesBetData.betPaid = formData[`betPaid`];

    await dispatch(createMatchesBet(matchesBetData)).then(() => {
      toast.success('Schedina Creata!');
    });
  };

  return (
    <div>
      {console.log(formData , "aaaaaaaaa")
      }
      <Form className="mb-3" onSubmit={onSubmit}>
        {formBlocks.map((formBlock, index) => (
          <div key={formBlock + index}>
            <h6>Giocata: {index + 1} <span className='text-danger'><FaRegTrashAlt onClick={() => deleteBlock(index)} /></span></h6>
            <Form.Group className="mb-3">
              <Form.Label>Tipster</Form.Label>
              <Form.Control
                type="text"
                name={`tipster${index}`}
                value={formBlock[`tipster${index}`]?.value.nameTips || ''}
                onChange={onChange}
                className={errors[`tipster${index}`] ? 'border-danger' : ''}
                list={`tipster${index}`}
              />
              <datalist id={`tipster${index}`}>{renderOptions()}</datalist>
            </Form.Group>
            {/* {console.log(formBlock[`dateMatch${index}`], "XXXX")} 
            {console.log(formData[`${index}`].matchDate, "XXXX")}  */}
            <div style={{ display: 'flex' }}>
              <Form.Group className="mb-3 me-2">
                <Form.Label>Giorno evento</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name={`dateMatch${index}`}
                  value={formBlock[`dateMatch${index}`]  || ''}
                  onChange={onChange}
                  className={errors[`dateMatch${index}`] ? 'border-danger' : ''}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Leaga</Form.Label>
                <Form.Control
                  type="text"
                  name={`league${index}`}
                  value={formBlock[`league${index}`] || ''}
                  onChange={onChange}
                  className={errors[`league${index}`] ? 'border-danger' : ''}
                />
              </Form.Group>
            </div>
            <div style={{ display: 'flex' }}>
              <Form.Group className="mb-3 me-2">
                <Form.Label>Home Team</Form.Label>
                <Form.Control
                  type="text"
                  name={`homeTeam${index}`}
                  value={formBlock[`homeTeam${index}`] || ''}
                  onChange={onChange}
                  className={errors[`homeTeam${index}`] ? 'border-danger' : ''}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Away Team</Form.Label>
                <Form.Control
                  type="text"
                  name={`awayTeam${index}`}
                  value={formBlock[`awayTeam${index}`] || ''}
                  onChange={onChange}
                  className={errors[`awayTeam${index}`] ? 'border-danger' : ''}
                />
              </Form.Group>
            </div>
            <div style={{ display: 'flex' }}>
              <Form.Group className="mb-3 me-2">
                <Form.Label>Type of Bet</Form.Label>
                <Form.Control
                  type="text"
                  name={`typeOfBet${index}`}
                  value={formBlock[`typeOfBet${index}`] || ''}
                  onChange={onChange}
                  className={errors[`typeOfBet${index}`] ? 'border-danger' : ''}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Choice</Form.Label>
                <Form.Control
                  type="text"
                  name={`typeOfBet_choice${index}`}
                  value={formBlock[`typeOfBet_choice${index}`] || ''}
                  onChange={onChange}
                  className={errors[`typeOfBet_choice${index}`] ? 'border-danger' : ''}
                />
              </Form.Group>
            </div>
            {formBlock[`odds${index}`] }
            <Form.Group className="mb-3">
              <Form.Label>Odds</Form.Label>
              <Form.Control
                type="number"
                name={`odds${index}`}
                value={formBlock[`odds${index}`] || ''}
                onChange={onChange}
                className={errors[`odds${index}`] ? 'border-danger' : ''}
              />
            </Form.Group>
          </div>
        ))}
        {formBlocks.length > 0 && (
          <>
            <Form.Group className="mb-3" controlId="formBetPaid">
              <Form.Label>Importo</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={9999}
                name="betPaid"
                value={formData.betPaid || ''}
                onChange={onChange}
                className={errors.betPaid ? 'border-danger' : ''}
              />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ width: '100%' }}>
              Submit
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default MatchFormManualEdit;
