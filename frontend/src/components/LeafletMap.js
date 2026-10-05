import { useState, setState } from "react";
import { MapContainer, TileLayer, GeoJSON, Pane} from "react-leaflet";

import {useApolloClient, useQuery} from "@apollo/client";

import statesData from "../extras/us-states-polygons.js";
import cities_data from "../extras/Cities.js";

import USStateToolTip from "./USStateToolTip.js";

import { ZipCanvas } from "./ZipCanvas.js";

import {
  GET_ALL_ZIP_CODES,
  GET_AVG_HUMIDITY_BY_STATE,
  GET_AVG_TEMPERATURE_BY_STATE,
  GET_AVG_WIND_SPEED_BY_STATE,
  GET_HUMIDITY_BY_CITY_STATE,
  GET_TEMPERATURE_BY_CITY_STATE,
  GET_WIND_SPEED_BY_CITY_STATE,
  GET_TEMPERATURE_BY_ZIP,
  GET_HUMIDITY_BY_ZIP,
  GET_WIND_SPEED_BY_ZIP,
} from "../db/queries.js";

import "leaflet/dist/leaflet.css";

function onEachState(feature, layer) {
  layer.bindTooltip(feature.properties.name);
}

function onClick(feature){
  console.log("you just clicked" + feature.properties.name);
}

function getQueryConfig(info, zip_codes, mode){
  if (mode === "temperature") return { 
      query: GET_TEMPERATURE_BY_ZIP, 
      resolverName: "getTemperatureByZip", 
      fieldName: "temperature" 
  };
  if (mode === "humidity") return { 
      query: GET_HUMIDITY_BY_ZIP, 
      resolverName: "getHumidityByZip", 
      fieldName: "humidity" 
  };
  if (mode === "wind_speed") return { 
      query: GET_WIND_SPEED_BY_ZIP, 
      resolverName: "getWindSpeedByZip", 
      fieldName: "wind_speed" 
  };


}

export default function LeafletMap(props) {
  /* 
  get all the zips uploaded
  to the collection `weather_zip`
  */

  // useStates()
  const [toolTipOpened, SetToolTipOpened] = useState(true);

  const mode = props.mode;
  const { loading, error, data } = useQuery(GET_ALL_ZIP_CODES);

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

        {/* TAN STATE BACKGROUND */}
        <Pane
          name="stateFillPane"
          style={{ zIndex: 300 }}
        >
          <GeoJSON
            data={statesData}
            style={styles.stateFill}
            interactive={false}
          />
        </Pane>

        {/* ZIP DOTS */}
        <Pane
          name="zipPane"
          style={{ zIndex: 350 }}
        >
          {!loading && (
            <ZipCanvas zipCodes={zip_codes} />
          )}
        </Pane>

        {/* BLACK STATE BORDERS + CLICK EVENTS */}
        <Pane
          name="stateBorderPane"
          style={{ zIndex: 450 }}
        >
          <GeoJSON
            data={statesData}
            style={styles.stateBorder}
            onEachFeature={onEachState}
          />
        </Pane>
      
      </MapContainer>
    </div>
  );
}

/* LeafletMap.css */
const styles = {
  map: {
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

  stateFill: {
    color: "transparent",
    weight: 0,
    fillColor: "tan",
    fillOpacity: 0.5,
  },

  stateBorder: {
    color: "black",
    weight: 3,

    // IMPORTANT:
    // border only
    fillOpacity: 0,
  },
};