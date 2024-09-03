import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../components/Spinner'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ImageUploader from "../components/ImageUploader";
// import TextRecognition from "../components/TextRecognition";
// import MatchForm from "../components/MatchForm"
import ImageToText from '../components/utils/ImageToText'
import KeyWordPhrases from '../components/utils/KeyWordPhrases'
import GeminiForm from '../components/GeminiForm'


function OcrBoard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { foods, isLoading, isError, message } = useSelector(
    (state) => state.foods
  )
  const [recognizedText, setRecognizedText] = useState('');
  const [aIText, setAIText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isError) {
      console.log(message)
    }
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate, isError, message, dispatch, foods])


  const handleImageUpload = (image) => {
    // console.log(image, "image");
    setSelectedImage(image);
  };

  const textHandler = (text) => {
    setRecognizedText(text);
  }

  const AIText = (text) => {
    setAIText(text);
  }
  console.log(aIText, "last aIText nel padre");
  

  if (isLoading) {
    return <Spinner />
  }
  
  return (
    <>
      <Container style={{marginTop: "80px"}}>
        <Row>
          <Col xs={12}>
            <section className='heading'>
              <h1>Welcome {user && user.name}</h1>
            </section>
          </Col>
          <Col md={4}>
            <ImageUploader onImageUpload={handleImageUpload} />
            <KeyWordPhrases recognizedText={recognizedText}/>
          </Col>
          {/* <Col md={8}>
            {selectedImage && <TextRecognition selectedImage={selectedImage} keyWordAndPhrases={keyWordAndPhrases}/>}
          </Col> */}
          <Col md={8}>
          <ImageToText selectedImage={selectedImage} textHandler={textHandler}/>
          <GeminiForm recognizedText={recognizedText} AIText={AIText}/>
          {/* <MatchForm selectedImage={selectedImage} keyWordAndPhrases={keyWordAndPhrases}/> */}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default OcrBoard