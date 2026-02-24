import React, { useState, useEffect } from "react";
import USAMap from "react-usa-map";
import { useApolloClient } from "@apollo/client";
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
    const client = useApolloClient();
    let full_name = get_full_name(mode)

    const [statesCustomConfig, setStatesCustomConfig] = useState({});
    const [loading, setLoading] = useState(true);

    // pick the right query and field names based on mode
    const getQueryConfig = () => {
        if (mode === "temperature") return { 
            query: GET_AVG_TEMPERATURE_BY_STATE, 
            resolverName: "getAvgTemperatureByState", 
            fieldName: "temperature" 
        };
        if (mode === "humidity") return { 
            query: GET_AVG_HUMIDITY_BY_STATE, 
            resolverName: "getAvgHumidityByState", 
            fieldName: "humidity" 
        };
        if (mode === "wind_speed") return { 
            query: GET_AVG_WIND_SPEED_BY_STATE, 
            resolverName: "getAvgWindSpeedByState", 
            fieldName: "wind_speed" 
        };
    }

    const calculateFill = (value, min, max) =>
    {
        /*
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
            return interpolateColor(ratio, 218, 165, 32, 0, 200, 83);
        } 
        else if (mode === "wind_speed") {
            // Light Gray (calm) → Orange (intense)
            return interpolateColor(ratio, 255, 140, 0, 97, 23, 209);
        }
        return `#9f18dd`;
    }  


    useEffect(() => {
        const fetchAllStates = async () => {
            setLoading(true);
            const { query, resolverName, fieldName } = getQueryConfig();
            const stateEntries = Array.from(us_state_to_abbrev.entries());

            // fire all 50 state queries at the same time
            const results = await Promise.all(
                stateEntries.map(async ([state]) => {
                    const { data } = await client.query({ query, variables: { state } });
                    return { 
                        state, 
                        value: data?.[resolverName]?.[fieldName] ?? 0 
                    };
                })
            );

            // find min/max across all states
            const vals = results.map(r => r.value);
            const min = Math.min(...vals);
            const max = Math.max(...vals);

            // build the config object USAMap needs
            const config = {};
            results.forEach(({ state, value }) => {
                const abbrev = us_state_to_abbrev.get(state);
                config[abbrev] = { fill: calculateFill(value, min, max) };
            });

            setStatesCustomConfig(config);
            setLoading(false);
        };

        fetchAllStates();
    }, [mode, client]); // re-fetch whenever mode switches and event handlers for the map
    
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
