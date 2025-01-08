const {ApolloServer, gql} = require("apollo-server");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const { mergeResolvers } = require("@graphql-tools/merge");
const {Weather} = require("models/Weather.js");

const mongoose = require("mongoose")


// define your schemas
const TemperatureTypeDef = gql`
    type Temperature{
        city: String!
        state: String!
        temperature: Float!
        timestamp: String!
    }

    type Query{
        getMostRescentTemperature: [Temperature!]!
    }
`; 

const HumidityTypeDefs = gql`
    type Humidity{
        city: String!
        state: String!
        humidity: Float!
        timestamp: String!
    }

    type Query{
        getMostRecentHumidity(city: String!, state: String!): Humidity
    }
`;

const WindSpeedTypeDefs = gql`
    type WindSpeed {
        city: String!
        state: String!
        wind_speed: Float!
        timestamp: String!
    }

    type Query{
        getMostRecentWindSpeed: [WindSpeed!]
    }
`;

const TemperatureResolvers = {
    Query:{
        getMostRecentTemperature: async() =>{
            return await mongsoose.model("Weather").aggregate([
                {$sort: {state: 1, city:1, timestamap: -1}},
                {
                    $group: {
                        _id: "$city",
                        city: {$first: "$city"},
                        state: {$first: "$state"},
                        temperature: {$first: "$temperature"},
                        timestamp: {$first: "$timestamp"}
                    },
                },
                { $sort: { state: 1, city: 1 } },
            ]);
        },
    },
};

const HumidityResolvers = {
    Query: {
      getMostRecentHumidity: async (_,{city, state}) => {
        return await mongoose.model("Weather").findOne({city, state})
        .sort({timestamp: -1}).exec()
      },
    },
};

const WindSpeedResolvers = {
    Query: {
      getMostRecentHumidity: async () => {
        return await mongoose.model("Weather").aggregate([
          { $sort: { state: 1, city: 1, timestamp: -1 } },
          {
            $group: {
              _id: "$city",
              city: { $first: "$city" },
              state: { $first: "$state" },
              wind_speed: { $first: "$wind_speed" },
              timestamp: { $first: "$timestamp" },
            },
          },
          { $sort: { state: 1, city: 1 } },
        ]);
      },
    },
};


mongoose.connect()

const TypeDefs = mergeTypeDefs([
  TemperatureTypeDef,
  HumidityTypeDefs,
  WindSpeedTypeDefs                           
]);

const resolvers = mergeResolvers([
  HumidityResolvers, 
  TemperatureResolvers, 
  WindSpeedResolvers
]);

const server = new ApolloServer({TypeDefs, resolvers,});

server.listen().then(({url}) =>{console.log(`server ready at url: ${url}`)});


