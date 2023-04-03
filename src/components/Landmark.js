import React from 'react';
//import axios from 'axios';


function Landmark( {landmark_name, city, category, fact, latitude, longitude, image} ) {

  return (
    <div className="landmark">
      <h3 className="landmark_name">{landmark_name}</h3>
        <img className="image" src={image} />
        <div className="facts">
        <h3>City: {city}</h3>
        <h3>Fact: {fact}</h3>
        <h3>Latitude: {latitude}</h3>
        <h3>Longitude: {longitude}</h3>
        </div>
    <br /></div>
  )
}

export default Landmark;