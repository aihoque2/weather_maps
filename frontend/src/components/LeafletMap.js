import { useState, setState } from "react";
import { MapContainer, TileLayer, GeoJSON, Pane} from "react-leaflet";

import {useApolloClient, useQuery} from "@apollo/client";

import statesData from "../extras/us-states-polygons.js";
import cities_data from "../extras/Cities.js";
import Legend from "./Legend.js";

import USStateToolTip from "./USStateToolTip.js";

import { ZipCanvas } from "./ZipCanvas.js";

import {
  GET_ALL_ZIP_WEATHER,
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

const getFullName = (mode) => {
  if (mode === "humidity") return "Humidity";
  if (mode === "wind_speed") return "Wind Speed";
  if (mode === "temperature") return "Temperature";
  return "";
};

const interpolateColor = (
  ratio,
  r1, g1, b1,
  r2, g2, b2
) => {
  const r = Math.round(r1 + ratio * (r2 - r1));
  const g = Math.round(g1 + ratio * (g2 - g1));
  const b = Math.round(b1 + ratio * (b2 - b1));

  const toHex = (val) =>
    val.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const calculateFill = (mode, value, min, max) => {
  const ratio =
    max === min
      ? 0.5
      : Math.min(
          Math.max((value - min) / (max - min), 0),
          1
        );

  if (mode === "temperature") {
    return interpolateColor(
      ratio,
      0, 0, 255,
      255, 0, 0
    );
  }

  if (mode === "humidity") {
    return interpolateColor(
      ratio,
      218, 165, 32,
      0, 200, 83
    );
  }

  if (mode === "wind_speed") {
    return interpolateColor(
      ratio,
      255, 140, 0,
      97, 23, 209
    );
  }

  return "#9f18dd";
};

export default function LeafletMap({ mode }) {
  const {
    loading,
    error,
    data
  } = useQuery(GET_ALL_ZIP_WEATHER);

  const zipWeather =
    data?.getAllZipWeather ?? [];

  const fieldName =
    mode === "temperature"
      ? "temperature"
      : mode === "humidity"
      ? "humidity"
      : "wind_speed";

  const values = zipWeather
    .map(point => point[fieldName])
    .filter(value => typeof value === "number");

  const minVal =
    values.length > 0
      ? Math.min(...values)
      : 0;

  const maxVal =
    values.length > 0
      ? Math.max(...values)
      : 0;

  const coloredZipWeather =
    zipWeather.map(point => ({
      ...point,

      value: point[fieldName],

      color: calculateFill(
        mode,
        point[fieldName],
        minVal,
        maxVal
      )
    }));

  if (error) {
    return (
      <div style={styles.wrapper}>
        Error loading ZIP weather:
        {error.message}
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        {getFullName(mode)}
      </h1>

      <div style={styles.wrapper}>
        <MapContainer
          center={[39.8, -98.6]}
          zoom={4}
          style={styles.map}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

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

          <Pane
            name="zipPane"
            style={{ zIndex: 350 }}
          >
            {!loading && (
              <ZipCanvas
                zipCodes={coloredZipWeather}
              />
            )}
          </Pane>

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

      { <Legend
        mode={mode}
        min={minVal}
        max={maxVal}
        interpolateColor={interpolateColor}
      /> }
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