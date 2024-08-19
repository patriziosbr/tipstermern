import React, { useState } from 'react';

const ImageUploader = ({ onImageUpload }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      onImageUpload(url);
    }
  };

  return (
    <div>

        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageUrl && (
          <div style={{ marginTop: '20px' }}>
            <img
              src={imageUrl}
              alt="Uploaded"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                border: '1px solid rgb(221, 221, 221)',
                borderRadius: '8px'
              }}
            />
          </div>
        )}
    </div>
  );
};

export default ImageUploader;



// import React, { useEffect, useState } from 'react';
// import Tesseract from 'tesseract.js';


// const ImageUploader = () => {
//   const [selectedImage, setSelectedImage] = useState(null);

//   const [recognizedText, setRecognizedText] = useState('');
//   useEffect(() => {
//     const recognizeText = async () => {
//       if (selectedImage) {
//         const result = await Tesseract.recognize(selectedImage);
//         setRecognizedText(result.data.text);
//       }
//     };
//     recognizeText();
//   }, [selectedImage]);

//   const handleImageUpload = (event) => {
//     const image = event.target.files[0];
//     setSelectedImage(URL.createObjectURL(image));

// };
// console.log(selectedImage, "selectedImage");


//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleImageUpload} />
//       {selectedImage && <img src={selectedImage} alt="Selected" />}
// <hr />
//       <h2>Recognized Texttt:</h2>
//       <p>{recognizedText}</p>
//     </div>
//   );
// };
// export default ImageUploader;