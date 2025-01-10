/*
TestComponent.js
component used to test 
database queries
*/

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_HUMIDITY_BY_CITY_STATE} from "../db/queries.js"; // Import the query

import yaml from "js-yaml";


export default function TestHumidity(props) {

    const cities_dict = yaml.load("./cities.yaml")
    
    const city_name = "St. Louis, MO";
    const state_name = "Missouri";


    const data = GET_HUMIDITY_BY_CITY_STATE(city_name, state_name);

}