import USAMapSelect from 'react-usa-map-select'

/*
colorMaps takes in the mode and 
then queries the data for the
mode passed in as a prop
*/

const ColorMap = (props) => {
    const handleClick = (event) => {
     // Handle click event
     console.log(`Clicked on state: ${event.currentTarget.getAttribute('name')}`);
    };
   
    const handleMouseEnter = (event) => {
     // Handle mouse enter event
     console.log(`Mouse entered state: ${event.currentTarget.getAttribute('name')}`);
    };
   
    const handleMouseLeave = () => {
     // Handle mouse leave event
     console.log('Mouse left a state');
    };
   
    return (
     <>
      <h1>Interactive USA Map</h1>
      <USAMapSelect
       onClick={handleClick}
       onUSAStateMouseEnter={handleMouseEnter}
       onUSAStateMouseLeave={handleMouseLeave}
       showStateNameOnHover={true}
       USAStateOnHoverColor="blue"
       USAStateOnHoverStrokeColor="white"
      />
     </>
    );
   };
   
   export default ColorMap;