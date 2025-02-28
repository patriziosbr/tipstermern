import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateMatch } from "../features/matches/matchSlice";
import { createMatchesBet } from "../features/matchesBet/matchesBetSlice";
import { updateMatchBet } from "../features/matchesBet/matchesBetSlice";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const MatchFormManualEdit = ({ selectedBetEdit, matchBets }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [formBlocks, setFormBlocks] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedBetEdit) {
      const selectedMatchEditTemp = selectedBetEdit;
      console.log(selectedMatchEditTemp, "selectedMatchEditTemp");
    
      // Create a new array to store updated matches
      const updatedMatches = selectedMatchEditTemp.matches.map(
        (single, index) => {
          const updatedSingle = {};
          // Iterate over the keys of each match
          Object.keys(single).forEach((key) => {
            // Update the key if it's not one of the excluded ones
            if (
              key !== "user" &&
              key !== "_v" &&
              key !== "createdAt" &&
              key !== "updatedAt"
            ) {
              const newKey = key + index;
              updatedSingle[newKey] = single[key]; // Assign the value to the new key
            } else {
              // Keep the original key-value pair for excluded keys
              updatedSingle[key] = single[key];
            }
          });
          return updatedSingle; // Return the updated match object
        }
      );
      // Update the formData and formBlocks state with the modified matches
      setFormData(
        updatedMatches.reduce((acc, match, index) => {
          // Destructure tipster from match and gather the rest of the fields
          const { tipster, ...rest } = match;
          const tipsterKey = `tipster${index}`
          const manipulatedTipster = match[tipsterKey]?.value?.nameTips !== undefined ? match[tipsterKey].value.nameTips : match[tipsterKey];
          // Return the merged object with the manipulated tipster field
          return { ...acc, ...rest, [tipsterKey]: manipulatedTipster, betPaid: selectedMatchEditTemp.betPaid };
        }, {})
      )
      setFormBlocks(updatedMatches);
    }
  }, [selectedBetEdit]);

  // console.log(formData, "what");

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const deleteBlock = (matchIndex) => {
    setFormBlocks((prevBlocks) => {
      const updatedBlocks = prevBlocks.filter(
        (_, index) => index !== matchIndex
      );

      const updatedFormData = { ...formData };
      Object.keys(formData).forEach((key) => {
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
    { value: { nameTips: "Tipster3", id: "3" }, option: "Tipster3" },
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
    console.log(formData, "formData");
    debugger
    // const newErrors = validateForm(formData);
    // if (Object.keys(newErrors).length > 0) {
    //   toast.error("Form submission failed due to validation errors.");
    //   return;
    // }

    const matchesArray = [];
    const totalMatches = Object.keys(formData).length / 15; //DARIV

    for (let i = 0; i < totalMatches; i++) {

      matchesArray.push({
        matchDate: formData[`dateMatch${i}`],
        league: formData[`league${i}`],
        homeTeam: formData[`homeTeam${i}`],
        awayTeam: formData[`awayTeam${i}`],
        typeOfBet: formData[`typeOfBet${i}`],
        typeOfBet_choice: formData[`typeOfBet_choice${i}`],
        odds: formData[`odds${i}`],
        tipster: formData[`tipster${i}`],
        matchWin: formData[`matchWin${i}`] ?? 2,
        matchId: formData[`_id${i}`],
        betPaid: formData[`betPaid`]
      });
    }

    let scehdinaData = {
      matchId: selectedBetEdit._id,
      matchData: {
        ...selectedBetEdit,
        betPaid: formData.betPaid,
      }
    };

    await dispatch(updateMatch(matchesArray)).then((result) => {
      // console.log(result, "result");
    });
    
    await dispatch(updateMatchBet(scehdinaData)).then((result) => {
      console.log(result, "result");
      if (result.error) {
        toast.error("Errore nella creazione della schedina!");
        return;
      } else {
        toast.success("Schedina Aggiornata!");
        
      }
    });
  };

  return (
    <div>
      {/* {console.log(formData, "aaaaaaaaa")} */}
      <Form className="mb-3" onSubmit={onSubmit}>
        {formBlocks.map((formBlock, index) => (
          <div key={formBlock + index}>
            <h6>
              Giocata: {index + 1}{" "}
              <span className="text-danger">
                <FaRegTrashAlt onClick={() => deleteBlock(index)} />
              </span>
            </h6>
            <Form.Group className="mb-3">

              <Form.Label>Giocata id: {formData[`_id${index}`]}</Form.Label><br/>
              <Form.Label>Tipster: 
                {/* {JSON.stringify(formData[`tipster${index}`])} */}
              </Form.Label>

              {/* <>
                <Form.Control
                  type="text"
                  name={`tipster${index}`}
                  value={formData[`tipster${index}`] || ""}
                  onChange={onChange}
                  className={errors[`tipster${index}`] ? "border-danger" : ""}
                  list={`tipster${index}`}
                />
                <datalist id={`tipster${index}`}>{renderOptions()}</datalist>
              </> */}

            </Form.Group>
            <div style={{ display: "flex" }}>
              <Form.Group className="mb-3 me-2">
                <Form.Label>Giorno evento</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name={`dateMatch${index}`}
                  value={formData[`dateMatch${index}`] || ""}
                  onChange={onChange}
                  className={errors[`dateMatch${index}`] ? "border-danger" : ""}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Leaga</Form.Label>
                <Form.Control
                  type="text"
                  name={`league${index}`}
                  value={formData[`league${index}`] || ""}
                  onChange={onChange}
                  className={errors[`league${index}`] ? "border-danger" : ""}
                />
              </Form.Group>
            </div>
            <div style={{ display: "flex" }}>
              <Form.Group className="mb-3 me-2">
                <Form.Label>Home Team</Form.Label>
                <Form.Control
                  type="text"
                  name={`homeTeam${index}`}
                  value={formData[`homeTeam${index}`] || ""}
                  onChange={onChange}
                  className={errors[`homeTeam${index}`] ? "border-danger" : ""}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Away Team</Form.Label>
                <Form.Control
                  type="text"
                  name={`awayTeam${index}`}
                  value={formData[`awayTeam${index}`] || ""}
                  onChange={onChange}
                  className={errors[`awayTeam${index}`] ? "border-danger" : ""}
                />
              </Form.Group>
            </div>
            <div style={{ display: "flex" }}>
              <Form.Group className="mb-3 me-2">
                <Form.Label>Type of Bet</Form.Label>
                <Form.Control
                  type="text"
                  name={`typeOfBet${index}`}
                  value={formData[`typeOfBet${index}`] || ""}
                  onChange={onChange}
                  className={errors[`typeOfBet${index}`] ? "border-danger" : ""}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Choice</Form.Label>
                <Form.Control
                  type="text"
                  name={`typeOfBet_choice${index}`}
                  value={formData[`typeOfBet_choice${index}`] || ""}
                  onChange={onChange}
                  className={
                    errors[`typeOfBet_choice${index}`] ? "border-danger" : ""
                  }
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Odds</Form.Label>
              <Form.Control
                type="text"
                name={`odds${index}`}
                value={formData[`odds${index}`] || ""}
                onChange={onChange}
                className={errors[`odds${index}`] ? "border-danger" : ""}
              />
            </Form.Group>
          </div>
        ))}
        <hr />
        {formBlocks.length > 0 && (
          <>
            <Form.Group className="mb-3" controlId="formBetPaid">
              <Form.Label>Importo</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={9999}
                name="betPaid"
                value={formData.betPaid || ""}
                onChange={onChange}
                className={errors.betPaid ? "border-danger" : ""}
              />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default MatchFormManualEdit;