import { gql } from "@apollo/client";

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

  