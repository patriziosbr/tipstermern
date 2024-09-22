import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../components/Spinner'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ImageUploader from "../components/ImageUploader";
// import TextRecognition from "../components/TextRecognition";
import MatchForm from "../components/MatchForm"
import MatchFormManual from "../components/MatchFormManual"
import ImageToText from '../components/utils/ImageToText'
import KeyWordPhrases from '../components/utils/KeyWordPhrases'
import GeminiForm from '../components/GeminiForm'


function OcrBoard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { foods, isLoading, isError, message } = useSelector((state) => state.foods);
  const [recognizedText, setRecognizedText] = useState('');
  const [aIText, setAIText] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGeminiComplete, setIsGeminiComplete] = useState(false);

  const handleGeminiComplete = () => {
    setIsGeminiComplete(true);
  };

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate, isError, message, dispatch, foods]);

  const handleImageUpload = (image) => {
    setSelectedImage(image);
  };

  const textHandler = (text) => {
    setRecognizedText(text);
  };

  const AITextHandler = (text) => {
    setAIText(text);
  };

  let classScrollDown =  {
    "position" : 'fixed',
    "top" : '60px',
    "zIndex" : '888',
    "width" : 'calc(100vw - 60px)',
  } 
  let classScrollDownDesktop =  {
    "position" : 'fixed',
    "top" : '40px',
    "zIndex" : '777',
    "minWidth" : '100px',
    "maxWidth":"400px" 
  } 

  let classScrollUp = {
    "position" : 'relative',
    "top" : '0',
    "left" : '0',
    "zIndex" : 'unset',
    "width": '100%',
  }

  const [classOver, setClassOver] = useState(classScrollUp);

  const handleScroll = () => {
      const position = window.pageYOffSet || document.documentElement.scrollTop
      const viewWidth = window.innerWidth;
      if(position >= 100 ){
        if(viewWidth > 750) {
          setClassOver(classScrollDownDesktop)
        } else {
          setClassOver(classScrollDown)
        }
      } else if(position === 0) {
        setClassOver(classScrollUp)
      } else {
        setClassOver(classScrollUp)
      }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
}, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    < >
      <Container style={{ marginTop: '80px' }} >
        <Row>
          <Col xs={12}>
            <section className="heading">
              <h1>Welcome {user && user.name}</h1>
            </section>
          </Col>
          <Col md={4} onScroll={handleScroll} >
            <div style={{...classOver}}>
              <ImageUploader onImageUpload={handleImageUpload} />
              <KeyWordPhrases recognizedText={recognizedText} />
            </div>
          </Col>
          <Col md={8}>
            <ImageToText selectedImage={selectedImage} textHandler={textHandler} />
            <GeminiForm
              recognizedText={recognizedText}
              AIText={AITextHandler}
              setAIText={setAIText}
              onComplete={handleGeminiComplete}
            />
            {/* DA RINOMIARE EMIT */}
            {isGeminiComplete && <MatchForm aIText={aIText} recognizedText={recognizedText}/>}
            {!isGeminiComplete && <MatchFormManual/>}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default OcrBoard;




// import { useEffect, useState } from "react"
// import { useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import Spinner from '../components/Spinner'
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

// import ImageUploader from "../components/ImageUploader";
// // import TextRecognition from "../components/TextRecognition";
// import MatchForm from "../components/MatchForm"
// import ImageToText from '../components/utils/ImageToText'
// import KeyWordPhrases from '../components/utils/KeyWordPhrases'
// import GeminiForm from '../components/GeminiForm'


// function OcrBoard() {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { user } = useSelector((state) => state.auth)
//   const { foods, isLoading, isError, message } = useSelector(
//     (state) => state.foods
//   )
//   const [recognizedText, setRecognizedText] = useState('');
//   const [aIText, setAIText] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);

//   useEffect(() => {
//     if (isError) {
//       console.log(message)
//     }
//     if (!user) {
//       navigate('/login')
//     }
//   }, [user, navigate, isError, message, dispatch, foods])


//   const handleImageUpload = (image) => {
//     // console.log(image, "image");
//     setSelectedImage(image);
//   };

//   const textHandler = (text) => {
//     setRecognizedText(text);
//   }

//   const AIText = (text) => {
//     setAIText(text);
//   }
//   console.log(aIText, "last aIText nel padre");
  

//   if (isLoading) {
//     return <Spinner />
//   }
  
//   return (
//     <>
//       <Container style={{marginTop: "80px"}}>
//         <Row>
//           <Col xs={12}>
//             <section className='heading'>
//               <h1>Welcome {user && user.name}</h1>
//             </section>
//           </Col>
//           <Col md={4}>
//             <ImageUploader onImageUpload={handleImageUpload} />
//             <KeyWordPhrases recognizedText={recognizedText}/>
//           </Col>
//           {/* <Col md={8}>
//             {selectedImage && <TextRecognition selectedImage={selectedImage} keyWordAndPhrases={keyWordAndPhrases}/>}
//           </Col> */}
//           <Col md={8}>
//           <ImageToText selectedImage={selectedImage} textHandler={textHandler}/>
//           <GeminiForm recognizedText={recognizedText} AIText={AIText}/> 
//           {/* DA RINOMIARE EMIT */}
//           <MatchForm  aIText={aIText}/>
//           </Col>
//         </Row>
//       </Container>
//     </>
//   )
// }

// export default OcrBoard