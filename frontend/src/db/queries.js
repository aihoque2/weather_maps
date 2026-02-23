import { gql } from "@apollo/client";

/*
see: https://www.apollographql.com/docs/react/data/queries
*/

// Humidity
export const GET_HUMIDITY_BY_CITY_STATE = gql`
  query GetMostRecentHumidity($city: String!, $state: String!) {
    getMostRecentHumidityByCity(city: $city, state: $state) {
      city
      state
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
  query GetMostRecentTemperature($city: String!, $state: String!) {
    getMostRecentTemperatureByCity(city: $city, state: $state) {
      city
      state
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
  query GetMostRecentWindSpeed($city: String!, $state: String!) {
    getMostRecentWindSpeedByCity(city: $city, state: $state) {
      city
      state
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
