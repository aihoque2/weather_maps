import React from "react";
import USAMap from "react-usa-map";
import { useQuery } from "@apollo/client";
import "./ColorMap.css"
import us_state_to_abbrev from "../extras/NameToAbbv.js"

import { GET_AVG_HUMIDITY_BY_STATE, 
    GET_AVG_TEMPERATURE_BY_STATE, 
    GET_AVG_WIND_SPEED_BY_STATE
        
} from "../db/queries.js"; // Import the query


const get_full_name = (mode) => {

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

    // convert to hex in case USAMap doesn't accept rgb()
    const toHex = (val) => val.toString(16).padStart(2, '0');
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const ColorMap = (props) => {
    const mode = props.mode
    
    let full_name = get_full_name(mode)

    const queryData = (state_name) =>{
        /*
        query data based on the 'mode' prop
        depending on the mode, we will
        have to get average value for the
        state's mode (temp, humid, wind)
        */

        if (mode === "temperature") {

        const {loading, error, data} = useQuery(GET_AVG_TEMPERATURE_BY_STATE, 
                                                    {variables: {state: state_name}});
        
            if (loading) return <h1>LOADING....</h1>;
            if (error) return <h1>Error! No Temperature data found: {error.message}</h1>;
            if (!data?.getAvgTemperatureByState) return <h1>No data found for {state_name}</h1>;
                
        } 
        else if (mode === "humidity") {
        const {loading, error, data} = useQuery(GET_AVG_HUMIDITY_BY_STATE, 
                                                    {variables: {state: state_name}});
            
            if (loading) return <h1>LOADING....</h1>;
            if (error) return <h1>Error! No Humidity data found: {error.message}</h1>;
            if (!data?.getAvgHumidityByState) return <h1>No Humidity data found for {state_name}</h1>;
        } 
        else if (mode === "wind_speed") {
            const {loading, error, data} = useQuery(GET_AVG_WIND_SPEED_BY_STATE, 
                                                    {variables: {state: state_name}});
            if (loading) return <h1>LOADING....</h1>;
            if (error) return <h1>Error! No Humidity data found: {error.message}</h1>;
            if (!data?.getAvgWindSPeedByState) return <h1>No Humidity data found for {state_name}</h1>;
        }    
        return 0;
    }


    const calculateFill = (value, min, max) =>
    {
        /*
        TODO:

        given the us_state
        to fill, return
        the RGB value for this fill.
        */
        const ratio = max === min ? 0.5 : Math.min(Math.max((value - min) / (max - min), 0), 1);

        if (mode === "temperature") {
            // Blue (cold) → Red (hot)
            return interpolateColor(ratio, 0, 0, 255, 255, 0, 0);
        } 
        else if (mode === "humidity") {
            // Desert sand/gold brown (dry) → Green (humid)
            return interpolateColor(ratio, 240, 240, 240, 0, 200, 83);
        } 
        else if (mode === "wind_speed") {
            // Light Gray (calm) → Orange (intense)
            return interpolateColor(ratio, 200, 200, 200, 255, 140, 0);
        }
        return `#9f18dd`;
    }  


    const statesCustomConfig = {};
    const stateEntries = [...us_state_to_abbrev.keys()];
    console.log("here's stateEntries: ", stateEntries);
    let values = []; // our values of shi
    for (var entry in stateEntries){
        values.push(queryData(entry));
    }
    const min = Math.min(...values);
    const max = Math.max(...values);

    for (var entry in stateEntries){
        var stateAbbrev = us_state_to_abbrev[entry];
        const modeVal = queryData(entry);
        const fillVal = calculateFill(modeVal, min, max);
        statesCustomConfig[stateAbbrev] = { fill: fillVal }

    }

    // Define custom styles and event handlers for the map
    
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
