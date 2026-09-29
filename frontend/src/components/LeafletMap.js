import { useState, setState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import statesData from "../extras/us-states-polygons.js";
import { throwServerError, useApolloClient, useQuery } from "@apollo/client";
import "leaflet/dist/leaflet.css";
import {GET_ALL_ZIP_CODES} from "../db/queries.js";

function onEachState(feature, layer) {
  layer.bindTooltip(feature.properties.name);
}

function onClick(feature){
  console.log("you just clicked" + feature.properties.name);
}

export default function LeafletMap(props) {
  /* 
  get all the zips uploaded
  to the collection `weather_zip`
  */
 const mode = props.mode
  const { loading, error, data } =
    useQuery(GET_ALL_ZIP_CODES);

  const zip_codes = data?.getAllZipCodes ?? [];

  console.log("loading:", loading);
  console.log("zip_codes length:", zip_codes.length);

  if (error) {
    return (
      <div style={styles.wrapper}>
        Error loading ZIP codes: {error.message}
      </div>
    );
  }




  return (
    <div style={styles.wrapper}>
      <MapContainer
        center={[39.8, -98.6]}
        zoom={4}
        style={styles.map}
      >
        {/* actual geographic map */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* YOUR STATE POLYGONS */}
        <GeoJSON
          data={statesData}
          style={styles.state}
          onEachFeature={onEachState}
        />
      </MapContainer>
    </div>
  );
}

/* LeafletMap.css */
  const styles={
    map:{
      width: "100%",
      height: "100%",
    },

    wrapper: {
      width: "100%",
      height: "700px",
      position: "relative",
      border: "4px solid black",
      borderRadius: "12px",
      overflow: "hidden",
      boxSizing: "border-box",
    },

    state: {
      color: "black",
      weight: 3,
      fillColor: "tan",
      fillOpacity: 0.5,
    },

}