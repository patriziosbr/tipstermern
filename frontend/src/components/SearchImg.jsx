import { useState } from "react"
import Form from 'react-bootstrap/Form';


function SearchImg(props) {
  const [userInput, setUserInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgBaseClean, setImgBaseClean] = useState('');
  const [selectedImageCSS, setSelectedImageCSS] = useState('');


  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setUserInput(inputText);

    const imageContext = require.context('../icons', false, /\.(png|jpg|jpeg|gif|svg)$/);
    const imageFiles = imageContext.keys().map((filename) => filename.replace('./', ''));
    const matchingImage = getImageByInput(inputText, imageFiles);
    
    if (matchingImage) {
      setSelectedImage(require(`../icons/${matchingImage}`));
    } else {
      setSelectedImage(null);
    }
  };

  const getImageByInput = (input, imageFiles) => {
    // Filter through your image filenames and find a match
    const matchingImage = imageFiles.find((filename) =>
      filename.toLowerCase().includes(input.toLowerCase())
    );
    return matchingImage;
  };

  const imageSrc = (e) => {
    setImgBaseClean(e.target.src.split(',')[1])
    setSelectedImageCSS("border border-primary rounded p-1")
    props.updateFoodIcon(imgBaseClean);
  }
  

  return (
    <div>
      <Form.Group className="mb-3" controlId="foodIconGroup">
        <input type="hidden" name="foodIcon" value={imgBaseClean} />
        <Form.Label>Food Icona</Form.Label>
        <Form.Control type="text" placeholder="Type something to search for an image" name="pippo" value={userInput} onChange={handleInputChange} />
      </Form.Group>
      {selectedImage && (
        <div>
          <img src={selectedImage} alt="Show vegetable"  onClick={imageSrc} className={"my-1 " + selectedImageCSS}/>
        </div>
      )}
    </div>
  );
};

export default SearchImg;
