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
      timestamp
    }
  }
`;

