/*
TestComponent.js
component used to test 
database queries
*/

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_HUMIDITY_DATA } from "./queries"; // Import the query

import yaml from "js-yaml";


export default function TestHumidity(props) {

    const cities_dict = yaml.load("./cities.yaml")


}