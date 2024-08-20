import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../components/Spinner'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ImageUploader from "../components/ImageUploader";
// import TextRecognition from "../components/TextRecognition";
import MatchForm from "../components/matchForm.jsx";



function OcrBoard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { foods, isLoading, isError, message } = useSelector(
    (state) => state.foods
  )
  
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
    console.log(image, "image");
    setSelectedImage(image);
  };

  const textHandler = (text) => {
    // console.log(text, "text in parent");
  }
  const [keyWordAndPhrasesList, setKeyWordAndPhrasesList] = useState([]);
  const keyWordAndPhrases = (text) => {
    setKeyWordAndPhrasesList(text)
    // console.log(text, "keyWordAndPhrases");
  }

  if (isLoading) {
    return <Spinner />
  }
  
  return (
    <>
      <Container style={{marginTop: "80px"}}>
        <Row>
          <Col xs={12}>
            <section className='heading'>
              <h1>Welcome {user && user.name} back in js</h1>
            </section>
          </Col>
          <Col md={4}>
            <ImageUploader onImageUpload={handleImageUpload} />
            <div className="d-none d-lg-block mt-3">
              { keyWordAndPhrasesList.length > 0 &&<h5>Keywords&Phrases</h5> }
                <ul className="keywords">
                  {keyWordAndPhrasesList.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
                </ul>
            </div>
          </Col>
          {/* <Col md={8}>
            {selectedImage && <TextRecognition selectedImage={selectedImage} keyWordAndPhrases={keyWordAndPhrases}/>}
          </Col> */}
          <Col md={8}>
          <MatchForm selectedImage={selectedImage} keyWordAndPhrases={keyWordAndPhrases}/>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default OcrBoard