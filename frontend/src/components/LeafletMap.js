import {
  useState,
  useRef,
  useMemo,
  useEffect
} from "react";

import { MapContainer, TileLayer, GeoJSON, Pane } from "react-leaflet";

import { useApolloClient, useQuery } from "@apollo/client";

import statesData from "../extras/us-states-polygons.js";
import us_state_to_name from "../extras/StateToName.js";
import cities_data from "../extras/Cities.js";

import Legend from "./Legend.js";
import USStateToolTip from "./USStateToolTip.js";
import { ZipCanvas } from "./ZipCanvas.js";

import {
  GET_ALL_ZIP_WEATHER,
  GET_ALL_STATE_WEATHER_AVERAGES,
  GET_HUMIDITY_BY_CITY_STATE,
  GET_TEMPERATURE_BY_CITY_STATE,
  GET_WIND_SPEED_BY_CITY_STATE
} from "../db/queries.js";

import "leaflet/dist/leaflet.css";


const getCityQueryConfig = (mode) => {
  if (mode === "temperature") {
    return {
      query: GET_TEMPERATURE_BY_CITY_STATE,
      fieldName: "temperature"
    };
  }

  if (mode === "humidity") {
    return {
      query: GET_HUMIDITY_BY_CITY_STATE,
      fieldName: "humidity"
    };
  }

  if (mode === "wind_speed") {
    return {
      query: GET_WIND_SPEED_BY_CITY_STATE,
      fieldName: "wind_speed"
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
  const r =
    Math.round(r1 + ratio * (r2 - r1));

  const g =
    Math.round(g1 + ratio * (g2 - g1));

  const b =
    Math.round(b1 + ratio * (b2 - b1));

  const toHex = (val) =>
    val.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};


const calculateFill = (
  mode,
  value,
  min,
  max
) => {
  const ratio =
    max === min
      ? 0.5
      : Math.min(
          Math.max(
            (value - min) / (max - min),
            0
          ),
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


export default function LeafletMap({ mode, res}) {
  const client = useApolloClient();

  /*
   * ZIP data is large, so only fetch it while
   * the ZIP visualization is active.
   */
  const {
    loading: zipLoading,
    error: zipError,
    data: zipData
  } = useQuery(
    GET_ALL_ZIP_WEATHER,
    {
      skip: res !== "zip"
    }
  );

  /*
   * State averages are tiny (~50 records).

   * Keep these loaded in both modes so clicking
   * a state while viewing ZIPs can still display
   * that state's average.
   */
  const {
    loading: stateLoading,
    error: stateError,
    data: stateData
  } = useQuery(
    GET_ALL_STATE_WEATHER_AVERAGES
  );


  const [ selectedUSState, setSelectedUSState] = useState(null);

  const [ stateAverage, setStateAverage] = useState(null); // selectedstate average

  const [
    citiesData,
    setCitiesData
  ] = useState(null);


  /*
   * Leaflet callbacks can retain old React
   * closures, so refs give them current values.
   */
  const selectedUSStateRef =
    useRef(null);

  const stateAveragesRef =
    useRef({});

  const modeRef =
    useRef(mode);

  modeRef.current = mode;


  /*
   * Which weather property are we currently
   * visualizing?
   */
  const fieldName =
    mode === "temperature"
      ? "temperature"
      : mode === "humidity"
      ? "humidity"
      : "wind_speed";


  /*
   * ----------------------------
   * ZIP DATA
   * ----------------------------
   */

  const zipWeather =
    zipData?.getAllZipWeather ?? [];


  const zipValues = useMemo(
    () =>
      zipWeather
        .map(point => point[fieldName])
        .filter(
          value =>
            typeof value === "number"
        ),
    [zipWeather, fieldName]
  );


  const zipMinVal =
    zipValues.length
      ? Math.min(...zipValues)
      : 0;

  const zipMaxVal =
    zipValues.length
      ? Math.max(...zipValues)
      : 0;


  const coloredZipWeather = useMemo(
    () =>
      zipWeather.map(point => ({
        ...point,

        value:
          point[fieldName],

        color:
          calculateFill(
            mode,
            point[fieldName],
            zipMinVal,
            zipMaxVal
          )
      })),

    [
      zipWeather,
      fieldName,
      mode,
      zipMinVal,
      zipMaxVal
    ]
  );


  /*
   * ----------------------------
   * STATE DATA
   * ----------------------------
   */

  const stateWeather =
    stateData
      ?.getAllStateWeatherAverages
      ?? [];


  /*
   * Convert:
   *
   * [
   *   { state: "PA", temperature: 60 },
   *   { state: "CA", temperature: 75 }
   * ]
   *
   * into:
   *
   * {
   *   Pennsylvania: 60,
   *   California: 75
   * }
   *
   * This matters because GeoJSON uses full
   * state names.
   */
  const stateAverages = useMemo(() => {
    const averages = {};

    for (const observation of stateWeather) {
      const fullStateName =
        us_state_to_name.get(
          observation.state
        ) ?? observation.state;

      const value =
        observation[fieldName];

      if (typeof value === "number") {
        averages[fullStateName] =
          value;
      }
    }

    return averages;

  }, [
    stateWeather,
    fieldName
  ]);


  /*
   * Make the latest object available to
   * Leaflet click handlers.
   */
  stateAveragesRef.current =
    stateAverages;


  const stateValues =
    Object.values(stateAverages);


  const stateMinVal =
    stateValues.length
      ? Math.min(...stateValues)
      : 0;

  const stateMaxVal =
    stateValues.length
      ? Math.max(...stateValues)
      : 0;


  /*
   * Current legend should correspond to
   * whichever resolution is visible.
   */
  const minVal =
    res === "state"
      ? stateMinVal
      : zipMinVal;

  const maxVal =
    res === "state"
      ? stateMaxVal
      : zipMaxVal;


  /*
   * Close tooltip whenever weather metric
   * or geographic resolution changes.
   */
  useEffect(() => {
    selectedUSStateRef.current = null;

    setSelectedUSState(null);
    setCitiesData(null);
    setStateAverage(null);

  }, [mode, res]);


  /*
   * ----------------------------
   * STATE CLICK
   * ----------------------------
   */

  const handleStateClick =
    async (feature, event) => {

      const stateName =
        feature.properties.name;

      const mouseEvent =
        event.originalEvent;


      /*
       * Same state clicked twice:
       * close tooltip.
       */
      if (
        selectedUSStateRef.current &&
        selectedUSStateRef.current.name
          === stateName
      ) {
        selectedUSStateRef.current =
          null;

        setSelectedUSState(null);
        setCitiesData(null);
        setStateAverage(null);

        return;
      }


      const selectedState = {
        name: stateName,
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
      };

      selectedUSStateRef.current =
        selectedState;

      setSelectedUSState(
        selectedState
      );

      setCitiesData(null);


      /*
       * State average already came from
       * GET_ALL_STATE_WEATHER_AVERAGES.
       *
       * No need for another GraphQL request.
       */
      const average =
        stateAveragesRef.current[
          stateName
        ];

      setStateAverage(
        typeof average === "number"
          ? average
          : null
      );


      /*
       * City rows still come from weather_city.
       */
      const config =
        getCityQueryConfig(
          modeRef.current
        );

      if (!config) {
        return;
      }

      const {
        query,
        fieldName: cityFieldName
      } = config;


      const stateCities =
        cities_data[stateName] ?? [];


      try {
        const results =
          await Promise.all(
            stateCities.map(
              async (city) => {

                const { data } =
                  await client.query({
                    query,

                    variables: {
                      city,
                      state: stateName
                    }
                  });

                return {
                  city,

                  value:
                    data
                      ?.getMostRecentWeatherByCity
                      ?.[cityFieldName]
                    ?? "N/A"
                };
              }
            )
          );

        setCitiesData(results);
      }
      catch (err) {
        console.error(
          `Error loading cities for ${stateName}:`,
          err
        );

        setCitiesData([]);
      }
    };


  /*
   * This transparent border layer handles
   * all state clicks in BOTH resolutions.
   */
  function onEachState(
    feature,
    layer
  ) {
    layer.bindTooltip(
      feature.properties.name
    );

    layer.on(
      "click",
      event => {
        handleStateClick(
          feature,
          event
        );
      }
    );
  }


  /*
   * Only block rendering for an error
   * belonging to the active resolution.
   */
  if (
    res === "zip" &&
    zipError
  ) {
    return (
      <div style={styles.wrapper}>
        Error loading ZIP weather:
        {zipError.message}
      </div>
    );
  }

  if (
    res === "state" &&
    stateError
  ) {
    return (
      <div style={styles.wrapper}>
        Error loading state weather:
        {stateError.message}
      </div>
    );
  }


  return (
    <div>
      <h1
        style={{
          textAlign: "center"
        }}
      >
        {getFullName(mode)}
      </h1>


      <div style={styles.wrapper}>
        <MapContainer
          center={[39.8, -98.6]}
          zoom={4}
          style={styles.map}
        >

          <TileLayer
            attribution={
              "&copy; OpenStreetMap contributors"
            }
            url={
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />


          {/*
           * ZIP MODE:
           * tan states underneath ZIP dots
           */}
          {res === "zip" && (
            <Pane
              name="zipStateFillPane"
              style={{ zIndex: 300 }}
            >
              <GeoJSON
                data={statesData}
                style={styles.stateFill}
                interactive={false}
              />
            </Pane>
          )}


          {/*
           * STATE MODE:
           * actual choropleth polygons
           */}
          {res === "state" &&
            !stateLoading && (

            <Pane
              name="stateChoroplethPane"
              style={{ zIndex: 350 }}
            >
              <GeoJSON
                key={
                  `states-${mode}-${stateWeather.length}`
                }

                data={statesData}

                interactive={false}

                style={(feature) => {
                  const stateName =
                    feature.properties.name;

                  const value =
                    stateAverages[
                      stateName
                    ];

                  return {
                    color:
                      "transparent",

                    weight: 0,

                    fillColor:
                      typeof value
                        === "number"
                        ? calculateFill(
                            mode,
                            value,
                            stateMinVal,
                            stateMaxVal
                          )
                        : "#cccccc",

                    fillOpacity: 0.7
                  };
                }}
              />
            </Pane>
          )}


          {/*
           * ZIP MODE:
           * ~38k canvas points
           */}
          {res === "zip" &&
            !zipLoading && (

            <Pane
              name="zipPane"
              style={{ zIndex: 350 }}
            >
              <ZipCanvas
                zipCodes={
                  coloredZipWeather
                }
              />
            </Pane>
          )}


          {/*
           * Always render state borders
           * above the weather layers.
           *
           * This is the only interactive
           * state GeoJSON layer.
           */}
          <Pane
            name="stateBorderPane"
            style={{ zIndex: 450 }}
          >
            <GeoJSON
              key={
                `borders-${mode}-${res}`
              }

              data={statesData}

              style={
                styles.stateBorder
              }

              onEachFeature={
                onEachState
              }
            />
          </Pane>

        </MapContainer>
      </div>


      <Legend
        mode={mode}
        min={minVal}
        max={maxVal}
        interpolateColor={
          interpolateColor
        }
      />


      {selectedUSState && (
        <USStateToolTip
          us_state={
            selectedUSState.name
          }

          mode={mode}

          city_vals={
            citiesData
          }

          state_val={
            stateAverage
          }

          loc={{
            x: selectedUSState.x,
            y: selectedUSState.y
          }}

          onClose={() => {
            selectedUSStateRef.current =
              null;

            setSelectedUSState(null);
            setCitiesData(null);
            setStateAverage(null);
          }}
        />
      )}

    </div>
  );
}

const styles = {
  map: {
    width: "100%",
    height: "100%"
  },

  wrapper: {
    width: "100%",
    height: "700px",
    position: "relative",
    border: "4px solid black",
    borderRadius: "12px",
    overflow: "hidden",
    boxSizing: "border-box"
  },

  stateFill: {
    color: "transparent",
    weight: 0,
    fillColor: "tan",
    fillOpacity: 0.5
  },

  stateBorder: {
    color: "black",
    weight: 3,
    fillOpacity: 0
  }
};