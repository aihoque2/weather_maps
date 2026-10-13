import { useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Pane} from "react-leaflet";

import {useApolloClient, useQuery} from "@apollo/client";

import statesData from "../extras/us-states-polygons.js";
import us_state_to_name from "../extras/StateToName.js"
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

const getStateQueryConfig = (mode) => {
  if (mode === "temperature") {
    return {
      cityQuery: GET_TEMPERATURE_BY_CITY_STATE,
      avgQuery: GET_AVG_TEMPERATURE_BY_STATE,
      avgResolverName: "getAvgTemperatureByState",
      fieldName: "temperature",
    };
  }

  if (mode === "humidity") {
    return {
      cityQuery: GET_HUMIDITY_BY_CITY_STATE,
      avgQuery: GET_AVG_HUMIDITY_BY_STATE,
      avgResolverName: "getAvgHumidityByState",
      fieldName: "humidity",
    };
  }

  if (mode === "wind_speed") {
    return {
      cityQuery: GET_WIND_SPEED_BY_CITY_STATE,
      avgQuery: GET_AVG_WIND_SPEED_BY_STATE,
      avgResolverName: "getAvgWindSpeedByState",
      fieldName: "wind_speed",
    };
  }

  return null;
};


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

  const [selectedUSState, setSelectedUSState] = useState(null);
  const [stateAverage, setStateAverage] = useState(null);
  const [citiesData, setCitiesData] = useState(null);

  const selectedUSStateRef = useRef(null);



  const client = useApolloClient();

 const handleStateClick = async (feature, event) => {
  const stateName = feature.properties.name;

  console.log("You clicked state:", stateName);

  /*
   Leaflet's event wraps the original browser MouseEvent.
   Since USStateToolTip uses position: fixed,
   clientX/clientY are exactly what we want.
  */
  const mouseEvent = event.originalEvent;

  // Clicking the same state again closes it
  if (
    selectedUSStateRef.current &&
    selectedUSStateRef.current.name === stateName
  ) {
    selectedUSStateRef.current = null;
    setSelectedUSState(null);
    setCitiesData(null);
    setStateAverage(null);
    return;
  }

  const newSelectedState ={
    name: stateName,
    x: mouseEvent.clientX,
    y: mouseEvent.clientY,
  };

  // Keep React state and ref synchronized
  selectedUSStateRef.current = newSelectedState;
  setSelectedUSState(newSelectedState);

  // show Loading... while queries run
  setCitiesData(null);
  setStateAverage(null);

  const config = getStateQueryConfig(mode);

  if (!config) {
    return;
  }

  const {
    cityQuery,
    avgQuery,
    avgResolverName,
    fieldName,
  } = config;

  /*
   Leaflet GeoJSON already gives us the full state name:
   "Missouri", "California", etc.

   Therefore we don't need StateToName.js here.
  */
  const stateCities =
    cities_data[stateName] ?? [];

  try {
    /*
     Fetch:
       1. the state's average
       2. the 3-4 city observations

     at the same time.
    */
    const [avgResult, cityResults] =
      await Promise.all([
        client.query({
          query: avgQuery,
          variables: {
            state: stateName,
          },
        }),

        Promise.all(
          stateCities.map(async (city) => {
            const { data } =
              await client.query({
                query: cityQuery,
                variables: {
                  city,
                  state: stateName,
                },
              });

            return {
              city,
              value:
                data
                  ?.getMostRecentWeatherByCity
                  ?.[fieldName] ?? "N/A",
            };
          })
        ),
      ]);

    const average =
      avgResult.data
        ?.[avgResolverName]
        ?.[fieldName];

    console.log(
      `${stateName} average ${fieldName}:`,
      average
    );

    console.log(
      `${stateName} cities:`,
      cityResults
    );

    setStateAverage(
      typeof average === "number"
        ? average
        : null
    );

    setCitiesData(cityResults);
  }
  catch (err) {
    console.error(
      `Error loading weather for ${stateName}:`,
      err
    );

    setCitiesData([]);
    setStateAverage(null);
  }
};

  function onEachState(feature, layer) {
    layer.bindTooltip(feature.properties.name);
    layer.on("click", (event) => { handleStateClick(feature, event)});
  }

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

      {selectedUSState && (
          <USStateToolTip 
              us_state={selectedUSState.name}
              mode={mode}
              city_vals={citiesData}
              state_val = {stateAverage}
              loc={{ x: selectedUSState.x, y: selectedUSState.y }}
              onClose={() => {
                setSelectedUSState(null); 
                setCitiesData(null); 
                setStateAverage(null);
                selectedUSStateRef.current = null;
              }}
          />
      )}
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