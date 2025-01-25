import React, { useState } from "react";
import USAMap from "react-usa-map";
import "./ColorMap.css"
import state_to_name from "../extras/StateToName.js";

const ColorMap = (props) => {
    const mode = props.mode
    const [hoveredState, setHoveredState] = useState(null); // Track hovered state

    const calculateFill = (state) =>
    {
        /*
        TODO:

        given the value
        to fill with, return
        the RGB value for this fill.
        */
       const full_name = state_to_name[state];
       if (mode === "humidity"){}
       else if (mode === "wind_speed"){}
       else if (mode === "temperature"){}
    }   

    const handleClick = (event) => {
        console.log(`Clicked on state: ${event.target.dataset.name}`);
    };

    const statesCustomConfig = {}

    // Define custom styles and event handlers for the map

    return (
        <div style={{ textAlign: "center", margin: "20px" }}>
            <h1>{mode}</h1>
            <USAMap customize={statesCustomConfig} onClick={handleClick}/>
        </div>
    );
};

export default ColorMap;