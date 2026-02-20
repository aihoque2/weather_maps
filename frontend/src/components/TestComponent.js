/*
TestComponent.js
component used to test 
database queries
*/

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_HUMIDITY_BY_CITY_STATE} from "../db/queries.js"; // Import the query



export default function TestHumidity(props) {
    const city_name = "San Diego, CA";
    const state_name = "California";

    const {loading, error, data} = useQuery(GET_HUMIDITY_BY_CITY_STATE, 
                                            {variables: {city: city_name, state: state_name}});

    if (loading) return <h1>LOADING....</h1>;
    if (error) return <h1>`Error! No data found! ${error.message}`</h1>;


    
    console.log("here's data: ", data)
    return(
        <>
        <h3>I Present to You {data.getMostRecentHumidity.__typename}</h3>
        <h3> Of {city_name.substring(0, city_name.length-4)}, {state_name}</h3>
        <h1>{data.getMostRecentHumidity.humidity}</h1>
        </>
    )
}