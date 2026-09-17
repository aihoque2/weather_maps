import React, { useState, useEffect } from "react";

import { MapContainer, TileLayer, GeoJSON} from "react-leaflet";

import USStateToolTip from "./USStateToolTip.js";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import "./CityColorMap.css"
import us_state_to_abbrev from "../extras/NameToAbbv.js"
import us_state_to_name from "../extras/StateToName.js"
import cities_data from "../extras/Cities.js";
import "leaflet/dist/leaflet.css";


export default function LeafLetMap(){

return (<MapContainer
      center={[39.8, -98.6]}
      zoom={4}
      style={{ height: "700px", width: "100%" }}>
        <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
        </TileLayer>
        
        </MapContainer>);

}