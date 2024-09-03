import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import Form from 'react-bootstrap/Form';

const ImageToText = ({ selectedImage, textHandler }) => {
    const [recognizedText, setRecognizedText] = useState('');
    // const handle = ({target:{value}}) => setRecognizedText(value)

    const recognizeText = async () => {
      if (selectedImage) {
        const { data: { text } } = await Tesseract.recognize(selectedImage, 'eng');
        setRecognizedText(text);
        textHandler(text); // x passare text nel padre
      }
    };

    useEffect(() => {
        recognizeText();
    }, [selectedImage]);

    return (
        <>
            {/* <Form.Group className="mb-3" controlId={`test`}>
                <Form.Label className=''>Recognized Text:</Form.Label>
                <Form.Control disabled as="textarea" rows={10} value={recognizedText} name={`recognizedText`} onChange={handle}/>
            </Form.Group> */}

            {recognizedText && <h6>Recognized Text:</h6>}
            <p>{recognizedText.replace(/\n/g, "")}</p>
        </>
    )
}

export default ImageToText;