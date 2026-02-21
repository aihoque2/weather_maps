import React, { useState } from "react";
import USAMap from "react-usa-map";
import "./ColorMap.css"
import state_to_name from "../extras/StateToName.js";
import { useQuery } from "@apollo/client";


const us_states_subset = ["Missouri", "Pennsylvania", "California"] // subset to play around with first

const get_full_name = (mode, full_name) => {

        /*
        present whether data is Humidity,
        Wind Speed, or Temperature. 
        */
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

    let us_states_data = {}

    const queryData = (state) =>{
        /*
        query data based on the 'mode' prop
        depending on the mode, we will
        have to get average value for the
        state's mode (temp, humid, wind)
        */

        if (mode === "temperature") {
            // Blue (cold) → Red (hot)
            
        } 
        else if (mode === "humidity") {
            // Desert sand/gold brown (dry) → Green (humid)
        } 
        else if (mode === "wind_speed") {
            // Light Gray (calm) → Orange (intense)
        }    
    }

    let min = 0;
    let max = 200;
    const calculateFill = (us_state, value) =>
    {
        /*
        TODO:

        given the us_state
        to fill, return
        the RGB value for this fill.
        */
        const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);

        if (mode === "temperature") {
            // Blue (cold) → Red (hot)
            return interpolateColor(ratio, 0, 0, 255, 255, 0, 0);
        } 
        else if (mode === "humidity") {
            // Desert sand/gold brown (dry) → Green (humid)
            return interpolateColor(ratio, 194, 154, 89, 34, 139, 34);
        } 
        else if (mode === "wind_speed") {
            // Light Gray (calm) → Orange (intense)
            return interpolateColor(ratio, 200, 200, 200, 255, 140, 0);
        }
        return "rgb(200, 200, 200)";

    }   



    /* 
    get the avg {MODE} of 
    
    */ 
    for (let i = 0; i < us_states_subset.length; i++){
        console.log("here's US state:");
        console.log(us_states_subset[i])
    }

    calculateFill(null)

    // Define custom styles and event handlers for the map
    const statesCustomConfig = {}
    
    const handleClick = (event) => {
        console.log(`Clicked on state: ${event.target.dataset.name}`);
    };


    return (
        <div style={{ textAlign: "center", margin: "20px" }}>
            <h1>{full_name}</h1>
            <USAMap customize={statesCustomConfig} onClick={handleClick}/>
        </div>
    );
};

export default ColorMap;