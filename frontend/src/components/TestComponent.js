/*
TestComponent.js
component used to test 
database queries
*/

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_HUMIDITY_BY_CITY_STATE, GET_AVG_TEMPERATURE_BY_STATE, GET_AVG_WIND_SPEED_BY_STATE} from "../db/queries.js"; // Import the query



export default function TestHumidity(props) {
    const city_name = "San Diego, CA";
    const state_name = "California";

    const {loading, error, data} = useQuery(GET_HUMIDITY_BY_CITY_STATE, 
                                            {variables: {city: city_name, state: state_name}});

    if (loading) return <h1>LOADING....</h1>;
    if (error) return <h1>Error! No data found: {error.message}</h1>;
    if (!data?.getMostRecentWeatherByCity) return <h1>No data found for {city_name}</h1>;
    
    const weather = data.getMostRecentWeatherByCity;

    const data_name = Object.keys(weather).find(
        key => !["__typename", "location", "time"].includes(key)
    );

    console.log("here's data: ", data);
    return(
        <>
            <h3>I Present to You</h3>
            <h3>{data_name} Of {city_name}</h3>
            <h1>{data.getMostRecentWeatherByCity.humidity}</h1>
        </>
    )
}
