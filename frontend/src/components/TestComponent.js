/*
TestComponent.js
component used to test 
database queries
*/

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_HUMIDITY_BY_CITY_STATE} from "../db/queries.js"; // Import the query

export default function TestHumidity(props) {
    
    const city_name = "Saint Louis, MO";
    const state_name = "Missouri";

    const {loading, error, data} = useQuery(GET_HUMIDITY_BY_CITY_STATE, 
                                            {variables: {city: city_name, state: state_name}});


    if (loading) return <h1>LOADING....</h1>;
    if (error) return <h1>`Error! ${error.message}`</h1>;

    console.log("here's data: ", data.getMostRecentHumidity)
    return<h1>{data.getMostRecentHumidity.humidity}</h1>

}