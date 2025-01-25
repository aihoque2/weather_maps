import { gql } from "@apollo/client";

/*
see: https://www.apollographql.com/docs/react/data/queries
*/

export const GET_HUMIDITY_BY_CITY_STATE = gql`
  query GetMostRecentHumidity($city: String!, $state: String!) {
    getMostRecentHumidity(city: $city, state: $state) {
      city
      state
      humidity
      time
    }
  }
`;

export const GET_TEMPERATURE_BY_CITY_STATE = gql`
  query GetMostRecentTemperature($city: String!, $state: String!) {
    getMostRecentTemperature(city: $city, state: $state) {
      city
      state
      temperature
      time
    }
  }
`;

export const GET_WIND_SPEED_BY_CITY_STATE = gql`
  query GetMostRecentWindSpeed($city: String!, $state: String!) {
    getMostRecentWindSpeed(city: $city, state: $state) {
      city
      state
      temperature
      time
    }
  }
`;