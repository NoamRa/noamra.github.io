import React, { useState, useEffect } from "react";
import { getAllImages } from "../../Logic/gallery";

const Home = () => {

  const [ images, setImages ] = useState([]);
  
  const fetchImages = async () => {
    const images = await getAllImages();
    setImages(images);
  };

  useEffect(() => { fetchImages() }, []);

  return (
    <div>
      {console.log('home page')}
      {console.log(images)}
      Home Page
      {/* <button onClick={getAllImages}>test</button> */}
      <ul>
        {
          images.map(image => (
            <li key={image}>
              <a href={image}>
                <img src={image} alt={image}/>
              </a>
            </li>
          ))
        }
      </ul>
    </div>
  )

};

export default Home;