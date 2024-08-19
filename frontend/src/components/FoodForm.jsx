import { useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch } from 'react-redux'
// import { toast } from 'react-toastify'
// import SearchImg from '../components/SearchImg'

import { createFood } from '../features/foods/foodSlice'

function FoodForm() {

  const [formData, setfromData] = useState({
    foodName: "",
    foodWeight: "",
    courseType: "",
    foodIcon: ""
  })
  const {foodName, foodWeight, courseType} = formData;

  const dispatch = useDispatch()

  const onChange = (e) => {
    setfromData((prevState)=> ({
        ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  // const updateFoodIcon = (iconData) => {
  //   console.log(iconData);
  //   setfromData((prevState) => ({
  //     ...prevState,
  //     foodIcon: iconData,
  //   }));
  // };

  const [userInput, setUserInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgBaseClean, setImgBaseClean] = useState('');
  const [selectedImageCSS, setSelectedImageCSS] = useState('');


  // const handleInputChange = (e) => {
  //   const inputText = e.target.value;
  //   setUserInput(inputText);

  //   // const imageContext = require.context('../icons', false, /\.(png|jpg|jpeg|gif|svg)$/);
  //   // const imageFiles = imageContext.keys().map((filename) => filename.replace('./', ''));
  //   const matchingImage = getImageByInput(inputText, imageFiles);
    
  //   if (matchingImage) {
  //     setSelectedImage(require(`../icons/${matchingImage}`));
  //   } else {
  //     setSelectedImage(null);
  //   }
  // };

  const getImageByInput = (input, imageFiles) => {
    // Filter through your image filenames and find a match
    const matchingImage = imageFiles.find((filename) =>
      filename.toLowerCase().includes(input.toLowerCase())
    );
    return matchingImage;
  };

  const imageSrc = (e) => {
    const base64Clean = e.target.src.split(',')[1];
    setImgBaseClean(base64Clean);
    setSelectedImageCSS("border border-primary rounded p-1");
    // Use the base64Clean value in the callback function
    setfromData((prevState) => ({
      ...prevState,
      foodIcon: base64Clean,
    }));
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(createFood( formData ))
    // await dispatch(createFood( formData )).then((result)=>{
    //   console.log(result);
    // })
    setfromData({
        foodName: "",
        foodWeight: "",
        courseType: "",
        foodIcon: ""
    })
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
              <Form className="mb-3" onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="foodNameWhat">
                    <Form.Label>Food Name</Form.Label>
                    <Form.Control type="text" placeholder="pasta al sugo" name="foodName" value={foodName} onChange={onChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="foodWeightWhat">
                    <Form.Label>Food Name</Form.Label>
                    <Form.Control type="number" placeholder="100 gr" name="foodWeight" value={foodWeight} onChange={onChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="foodNameWhat">
                    <Form.Label>Pasto</Form.Label>
                    <Form.Control type="text" placeholder="pranzo cena merenda" name="courseType" value={courseType} onChange={onChange} />
                </Form.Group>
                {/* <SearchImg updateFoodIcon={updateFoodIcon} /> */}
                <Form.Group className="mb-3" controlId="foodIconGroup">
                  <input type="hidden" name="foodIcon" value={imgBaseClean} />
                  <Form.Label>Food Icona</Form.Label>
                  {/* <Form.Control type="text" placeholder="Type something to search for an image" name="pippo" value={userInput} onChange={handleInputChange} /> */}
                </Form.Group>
                {selectedImage && (
                  <div>
                    <img src={selectedImage} alt="Show vegetable"  onClick={imageSrc} className={"my-1 " + selectedImageCSS}/>
                  </div>
                )}
                <Button variant="primary" type="submit" style={{width:"100%"}} className="mt-1">
                    Submit
                </Button>
              </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default FoodForm
