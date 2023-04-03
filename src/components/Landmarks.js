import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Landmark from './Landmark';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


function Landmarks() 
{
  const [allLandmarks, setAllLandmarks] = useState([]);
  const [filterTwoLandmarks, setFilterTwoLandmarks] = useState([]);
  const [filteredLandmarks, setfilteredLandmarks] = useState([]);

  const [filterOne, setFilterOne] = useState("")
  const [filterTwo, setFilterTwo] = useState("");  
  const [filterThree, setFilterThree] = useState("");

  const [filterOneDropdown, setFilterOneDropdown] = useState( ['City', 'Landmark Type'] );
  const [filterTwoDropdown, setFilterTwoDropdown] = useState([]);
  const [filterThreeDropdown, setFilterThreeDropdown] = useState([]);

  const defaultCities = ['New York City', 'San Francisco', 'Detroit', 'Keystone', 'Toronto'];  
  const defaultLandmarkTypes = ['Statue', 'Bridge', 'Skyscraper', 'Residence'];

  const [filterTwoPlaceholder, setFilterTwoPlaceholder] = useState( "" );
  const [filterThreePlaceholder, setFilterThreePlaceholder] = useState( "" );

  const [filterTwoGuide, setFilterTwoGuide] = useState( "" );
  const [filterThreeGuide, setFilterThreeGuide] = useState( "" );

  const [filterThreeSwitch, setFilterThreeSwitch] = useState( "A" );

  
  const fetchAllLandmarks = async () => 
  {
      const { data } = await axios.get("/data/landmarks.json");
      setAllLandmarks(data);
  };


  const handleFilterOne = (e) => 
  {
    setFilterOne( e.value );
    fetchAllLandmarks();
    setFilterTwo( "" );
    setfilteredLandmarks( [] );

    if( !filterOneDropdown.includes("None") ) { setFilterOneDropdown( ["None", ...filterOneDropdown] ); }

    if( e.value === "City" ) 
    { 
      setFilterTwoDropdown( defaultCities ); 
      setFilterTwoPlaceholder( "Choose A City" );
    }
    if( e.value === "Landmark Type" ) 
    { 
      setFilterTwoDropdown( defaultLandmarkTypes ); 
      setFilterTwoPlaceholder( "Choose A Landmark Type" );
    }
  }
 

  const handleFilterTwo = (e) => 
  {
    setFilterTwo( e.value );
    filterThreeReset();
    setFilterTwoDropdown( ["None", ...defaultCities] );

    if( filterOne === "City" ) 
    {             
      let filterByCity = [];
      let filterLandmarkDropdown = [];
      for (let i = 0; i < allLandmarks.length; i++) 
      {
        if( e.value == allLandmarks[i].city ) 
        { 
          filterByCity.push( allLandmarks[i] );
          filterLandmarkDropdown.push( allLandmarks[i].category.charAt(0).toUpperCase() + allLandmarks[i].category.slice(1) ); 
        }
      }
      setFilterTwoDropdown( ["None", ...defaultCities] );
      setFilterTwoLandmarks( filterByCity );
      setfilteredLandmarks( filterByCity );
      setFilterThreePlaceholder( "Choose A Landmark Type" );
      setFilterThreeDropdown( [...new Set(filterLandmarkDropdown)]);
    }

    if( filterOne === "Landmark Type" ) 
    { 
      let filterByType = [];
      let filterCityDropdown = [];
      for (let i = 0; i < allLandmarks.length; i++) 
      {
        if( e.value.toLowerCase() == allLandmarks[i].category ) 
        { 
          filterByType.push( allLandmarks[i] );
          filterCityDropdown.push( allLandmarks[i].city ); 
        }
      }
      setFilterTwoDropdown( ["None", ...defaultLandmarkTypes] );
      setFilterTwoLandmarks( filterByType );
      setfilteredLandmarks( filterByType );
      setFilterThreePlaceholder( "Choose A City" );
      setFilterThreeDropdown( [...new Set(filterCityDropdown)]);
    }  
  }


  const handleFilterThree = (e) => 
  {
    setFilterThree( e.value );
    if( !filterThreeDropdown.includes("None") ) { setFilterThreeDropdown( ["None", ...filterThreeDropdown] ); }
    if( filterOne === "City" )
    {
      let lastFilter = filterTwoLandmarks.filter( (element) => 
      { 
        return element.category.charAt(0).toUpperCase() + element.category.slice( 1 ) === e.value;
      } );
      setfilteredLandmarks( lastFilter );      
    }

    if( filterOne === "Landmark Type" )
    {
      let lastFilter = filterTwoLandmarks.filter( (element) => 
      { 
        return element.city === e.value;

      } );
      setfilteredLandmarks( lastFilter );    
    }

    if( e.value === "None" ) { setfilteredLandmarks( filterTwoLandmarks ); }        
  }


  const filterThreeReset = () => 
  {
    setFilterThreeSwitch( prevSwitch => prevSwitch === "A" ? "B" : "A" );
  }


  const displayLandmarks = ( landmark, index ) => 
  { 
    return (
        <Landmark landmark_name = {landmark.landmark_name} city={landmark.city} 
                  fact={landmark.fact} latitude={landmark.location.latitude} 
                  longitude={landmark.location.longitude} image={landmark.image} />
    )
  }

  const displayFilter = () => {}


  useEffect( () => { fetchAllLandmarks(); }, [] );


  return (
    <div className="content">
      <div className="header">
        <h1 className="page_heading">Landmarks of the World</h1>
      </div>

      <div className="filters">
        <div className="filters_guide">
          <span className="one">FILTER SECTION</span>
        </div>
        <div className="filters_wrapper">
          <Dropdown className="filterOne" options={filterOneDropdown} onChange={handleFilterOne} 
                    placeholder="Select a Filter" />
          
          { filterOne == "City" && <Dropdown className="filterTwo" options={filterTwoDropdown} 
                    onChange={handleFilterTwo} placeholder={filterTwoPlaceholder} /> }

          { filterOne == "Landmark Type" && <Dropdown className="filterTwo" options={filterTwoDropdown} 
                    onChange={handleFilterTwo} placeholder={filterTwoPlaceholder} />}

          { ( filterTwo && filterThreeSwitch === "A" && filterTwo !== "None" ) && 
            <Dropdown className="filterThree" options={filterThreeDropdown} 
                      onChange={handleFilterThree} placeholder={filterThreePlaceholder} />}

          { ( filterTwo && filterThreeSwitch === "B" && filterTwo !== "None" ) && 
            <Dropdown className="filterThree" options={filterThreeDropdown} 
                      onChange={handleFilterThree} placeholder={filterThreePlaceholder} />}
        </div>
      </div>
      <div className="landmarks">
        { 
          filteredLandmarks.length == 0 && 
          allLandmarks.map( (landmark, index) => { return( displayLandmarks( landmark, index ) ) } ) 
        }
        { 
          filteredLandmarks.length !== 0 && 
          filteredLandmarks.map( (landmark, index) => { return( displayLandmarks( landmark, index ) ) } ) 
        }
      </div>                 
    </div>
  )
}

export default Landmarks;