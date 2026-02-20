import React, { useState } from "react";
import USAMap from "react-usa-map";
import "./ColorMap.css"
import state_to_name from "../extras/StateToName.js";

const get_full_name = (mode, full_name) => {
        if (mode === "humidity"){return "Humidity" }
       else if (mode === "wind_speed"){return "Wind Speed"}
       else if (mode === "temperature"){return "Temperature"}
       else return ""
}

const interpolateColor = (ratio, r1, g1, b1, r2, g2, b2) => {
    /*
        // Temperature: Blue (cold) → Red (hot) YES AI HELPED ME. HOW ELSE DO YOU DO JS
        // Wind Speed: Light Gray (calm) → Orange (intense)
        // Desert sand/gold brown (dry) → Green (humid)
    */
    const r = Math.round(r1 + ratio * (r2 - r1));
    const g = Math.round(g1 + ratio * (g2 - g1));
    const b = Math.round(b1 + ratio * (b2 - b1));
    return `rgb(${r}, ${g}, ${b})`;
};

const ColorMap = (props) => {
    const mode = props.mode
    const [hoveredState, setHoveredState] = useState(null); // Track hovered state
    
    let full_name = get_full_name(mode)


    const calculateFill = (us_state) =>
    {
        /*
        TODO:

        given the us_state
        to fill, return
        the RGB value for this fill.
        */

    }   

    const handleClick = (event) => {
        console.log(`Clicked on state: ${event.target.dataset.name}`);
    };

    const statesCustomConfig = {}

    calculateFill(null)

    // Define custom styles and event handlers for the map

    return (
        <div style={{ textAlign: "center", margin: "20px" }}>
            <h1>{full_name}</h1>
            <USAMap customize={statesCustomConfig} onClick={handleClick}/>
        </div>
    );
};

export default ColorMap;