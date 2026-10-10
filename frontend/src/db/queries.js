import { gql } from "@apollo/client";

/*
see: https://www.apollographql.com/docs/react/data/queries
*/

/*
Queries by city-state pair
*/

// Humidity 
export const GET_HUMIDITY_BY_CITY_STATE = gql`
  query GetMostRecentHumidityByCityState($city: String!, $state: String!) {
    getMostRecentWeatherByCity(city: $city, state: $state) {
      location {
            city
            state
      }
      humidity
      time
    }
  }
`;

export const GET_HUMIDITY_BY_ZIP = gql`
  query GetMostRecentHumidityByZip($zip: String!) {
    getMostRecentWeatherByZip(zip: $zip) {
      location {
            state
            zip
            lat
            lon
      }
      humidity
      time
    }
  }
`;

export const GET_AVG_HUMIDITY_BY_STATE = gql`
  query GetAvgHumidityByState($state: String!){
    getAvgHumidityByState(state: $state){
      state
      humidity
    }
  }
`;

// Temperature
export const GET_TEMPERATURE_BY_CITY_STATE = gql`
  query GetMostRecentTemperatureByCityState($city: String!, $state: String!) {
    getMostRecentWeatherByCity(city: $city, state: $state) {
      location {
            city
            state
      }
      temperature
      time
    }
  }
`;

export const GET_TEMPERATURE_BY_ZIP = gql`
  query GetMostRecentTemperatureByZip($zip: String!) {
    getMostRecentWeatherByZip(zip: $zip) {
      location {
            zip
            state
            lat
            lon
      }
      temperature
      time
    }
  }
`;

export const GET_AVG_TEMPERATURE_BY_STATE = gql`
  query GetAvgTemperatureByState($state: String!){
    getAvgTemperatureByState(state: $state){
      state 
      temperature
    }
  }
`;

// Wind Speed
export const GET_WIND_SPEED_BY_CITY_STATE = gql`
  query GetMostRecentWindSpeedByCityState($city: String!, $state: String!) {
    getMostRecentWeatherByCity(city: $city, state: $state) {
      location {
            city
            state
      }
      wind_speed
      time
    }
  }
`;


export const GET_WIND_SPEED_BY_ZIP = gql`
  query GetMostRecentWindSpeedByZip($zip: String!) {
    getMostRecentWeatherByZip(zip: $zip) {
      location {
            zip
            state
            lat
            lon
      }
      wind_speed
      time
    }
  }
`;

export const GET_AVG_WIND_SPEED_BY_STATE = gql`
  query GetAvgWindSpeedByState($state: String!){
    getAvgWindSpeedByState(state: $state){
      state
      wind_speed
    }
  }
`;

// for LeafletMap.js
export const GET_ALL_ZIP_WEATHER = gql`
  query GetAllZipWeather {
    getAllZipWeather {
      zip
      state
      lat
      lon
      temperature
      humidity
      wind_speed
    }
  }
`;

