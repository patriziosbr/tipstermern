import { useEffect, useState } from "react"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Form from 'react-bootstrap/Form';
import { Fragment } from "react";

function GeminiForm({ recognizedText, setAIText, onComplete }) {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setPromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_NODE_GEMINI);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const getResponseForGivenPrompt = async () => {
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(inputValue);
      setInputValue('');
      const response = result.response;
      const text = await response.text();
      console.log(text);
      const responsesArr = [...promptResponses, text];
      setAIText(responsesArr);
      setPromptResponses(responsesArr);
      setLoading(false);
      // Notify the parent that processing is complete
      onComplete();
    } catch (error) {
      console.log(error);
      console.log('Something Went Wrong');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recognizedText) {
      setInputValue(`ciao gemini, di seguito fornirò del testo, assicurati di eseguire le seguenti istruzioni correttamente, analizza soltanto il testo se ci sono dei match di calcio, basket, tennis o ping-pong, se il testo è diverso dagli argomenti elencati interrompi l'analisi e rispondi con "non posso analizzare testi diversi da match sportivi". Analizza quanti incontri ci sono, suddividi le informazioni in JSON e restituisci un ARRAY contenente JSON OBJECTS per ogni match. Esempio: '[{numeroDiMatch: 2, dateTimeMatch: 01/08/2024 00:00, homeTeam: Belgio, awayTeam: Montenegro, league: Internazionale - Amichevoli Internazionali, odds: 1.51, typeOfBet: 1X2, typeOfBet_choice: 1}, {... secondo match se esiste}]' non aggiungere ulteriori caratteri prima o dopo le [] restituisci sempre un array di oggetti. Testo da analizzare: ${recognizedText}`);
    }
  }, [recognizedText]);

  useEffect(() => {
    if (inputValue) {
      getResponseForGivenPrompt();
    }
  }, [inputValue]); // Add inputValue as a dependency to trigger the effect

  return (
    <>
        <Row>
          <Col xs={12}>

                  {/* <Form.Group className="mb-3" controlId={`test`}>
                  <Form.Label className=''>Recognized Text:</Form.Label>
                  <Form.Control disabled as="textarea" rows={10} value={inputValue} name={`recognizedText`} onChange={handleInputChange}/>
                  </Form.Group> */}
                  {/* <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Ask Me Something You Want"
                    className="form-control"
                  /> */}

              {loading ? (
                <div className="text-center mt-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Fragment >
                  {promptResponses.length > 0 && <h6 >AI Text:</h6>}
                  {promptResponses.map((promptResponse, index) => (
                    <div key={index} >
                      <div className={`response-text ${index === promptResponses.length - 1 ? 'fw-bold' : ''}`}>{promptResponse}</div>
                    </div>
                  ))
                  }
                </Fragment>
              )}
          </Col>
        </Row>

    </>
  )
}

export default GeminiForm




// import { useEffect, useState } from "react"

// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import Form from 'react-bootstrap/Form';
// import { Fragment } from "react";


// function GeminiForm({ recognizedText, AIText }) {

//   const [inputValue, setInputValue] = useState('');
//   const [promptResponses, setpromptResponses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const genAI = new GoogleGenerativeAI(
//     process.env.REACT_APP_NODE_GEMINI
//   );

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const getResponseForGivenPrompt = async () => {
//     try {
//       setLoading(true)
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//       const result = await model.generateContent(inputValue);
//       setInputValue('')
//       const response = result.response;
//       const text = response.text();
//       console.log(text)
//       const responsesArr = [...promptResponses,text]
//       AIText(responsesArr)
//       setpromptResponses(responsesArr);
  
//       setLoading(false)
//     }
//     catch (error) {
//       console.log(error)
//       console.log("Something Went Wrong");
//       setLoading(false)
//     }
//   };

//   useEffect(() => {
//     if (recognizedText) {
//       setInputValue(`ciao gemini, di seguito fornirò del testo, assicurati di eseguire le se seguenti istruzioni correttamente, analizza soltanto il testo se ci sono dei match di calcio, basket, tennis o ping-pong, se il testo è diverso da gli argomenti elencati interrompi la analisi e rispondi con "non posso analizzare testi diversi da match sportivi". Analizza quanti incontri ci sono e suddividi le informazioni in JSON e restituisci un array contenente un json per ogni match. Esempio: [{numeroDiMatch: 2, dateTimeMatch:  01/08/2024 00:00, homeTeam: Belgio, awayTeam: Montenegro, league: Internazionale - Amichevoli Internazionali, odds: 1.51, typeOfBet: 1X2, typeOfBet_choice: 1}, {... secondo match se esiste}]. Testo da analizzare: ${recognizedText}`)
//     }
//   }, [recognizedText]);

//   useEffect(() => {
//     if(inputValue) {
//       getResponseForGivenPrompt()
//     }
//   })
//   // console.log(recognizedText, "recognizedText");
  
//   return (
//     <>
//         <Row>
//           <Col xs={12}>

//                   {/* <Form.Group className="mb-3" controlId={`test`}>
//                   <Form.Label className=''>Recognized Text:</Form.Label>
//                   <Form.Control disabled as="textarea" rows={10} value={inputValue} name={`recognizedText`} onChange={handleInputChange}/>
//                   </Form.Group> */}
//                   {/* <input
//                     type="text"
//                     value={inputValue}
//                     onChange={handleInputChange}
//                     placeholder="Ask Me Something You Want"
//                     className="form-control"
//                   /> */}

//               {loading ? (
//                 <div className="text-center mt-3">
//                   <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </div>
//                 </div>
//               ) : (
//                 <Fragment >
//                   {promptResponses.length > 0 && <h6 >AI Text:</h6>}
//                   {promptResponses.map((promptResponse, index) => (
//                     <div key={index} >
//                       <div className={`response-text ${index === promptResponses.length - 1 ? 'fw-bold' : ''}`}>{promptResponse}</div>
//                     </div>
//                   ))
//                   }
//                 </Fragment>
//               )}
//           </Col>
//         </Row>

//     </>
//   )
// }

// export default GeminiForm
