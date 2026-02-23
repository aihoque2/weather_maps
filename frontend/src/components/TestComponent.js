/*
TestComponent.js
component used to test 
database queries
*/

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_HUMIDITY_BY_CITY_STATE, GET_AVG_TEMPERATURE_BY_STATE} from "../db/queries.js"; // Import the query



export default function TestHumidity(props) {
    const city_name = "San Diego, CA";
    const state_name = "Pennsylvania";

    const {loading, error, data} = useQuery(GET_AVG_TEMPERATURE_BY_STATE, 
                                            {variables: {state: state_name}});

    if (loading) return <h1>LOADING....</h1>;
    if (error) return <h1>Error! No data found: {error.message}</h1>;
    if (!data?.getAvgTemperatureByState) return <h1>No data found for {state_name}</h1>;
    
    console.log("here's data: ", data);
    return(
        <>
            <h3>I Present to You {data.getAvgTemperatureByState.__typename}</h3>
            <h3>Of {state_name}</h3>
            <h1>{data.getAvgTemperatureByState.temperature}</h1>
        </>
    )
}
