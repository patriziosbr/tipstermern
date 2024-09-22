import React, { useState, useEffect  } from 'react';

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

  let classScrollDown =  {
    "position" : 'fixed',
    "top" : '60px',
    "zIndex" : '9999',
    "width" : 'calc(100vw - 60px)',
  } 
  let classScrollDownDesktop =  {
    "position" : 'fixed',
    "top" : '60px',
    "zIndex" : '9999',
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

//   const [classOver, setClassOver] = useState(classScrollUp);

//   const handleScroll = () => {
//       const position = window.pageYOffSet || document.documentElement.scrollTop
//       const viewWidth = window.innerWidth;
//       if(position >= 60 ){
//         if(viewWidth > 750) {
//           setClassOver(classScrollDownDesktop)
//         } else {
//           setClassOver(classScrollDown)
//         }
//       } else if(position === 0) {
//         setClassOver(classScrollUp)
//       } else {
//         setClassOver(classScrollUp)
//       }
//   };

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll, { passive: true });

//     return () => {
//         window.removeEventListener('scroll', handleScroll);
//     };
// }, []);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageUrl && (
        <div
          style={{
            marginTop: '20px',
            border: '1px solid black',
            padding: '10px',
            position: 'relative',
            backgroundColor: '#fff'
          }}
        >
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
