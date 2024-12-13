import React, { useState } from "react";
import USAMap from "react-usa-map";
import "./ColorMap.css"

const ColorMap = (props) => {
    const mode = props.mode
    const [hoveredState, setHoveredState] = useState(null); // Track hovered state

    const handleClick = (event) => {
        console.log(`Clicked on state: ${event.target.dataset.name}`);
    };

    // Define custom styles and event handlers for the map
    const statesCustomConfig = () => {
    };

    return (
        <div style={{ textAlign: "center", margin: "20px" }}>
            <h1>{mode}</h1>
            <USAMap customize={statesCustomConfig} onClick={handleClick}/>
            <p>Hovered State: {hoveredState ? hoveredState : "None"}</p>
        </div>
    );
};

export default ColorMap;