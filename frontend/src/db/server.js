const auth = require("./auth.json")
const {ApolloServer, gql} = require("apollo-server");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const { mergeResolvers } = require("@graphql-tools/merge");
const Weather = require("./models/Weather.js"); // module.exports
const {mongoose} = require("mongoose");

/*
TODO: use this guy's code for reference:
https://codedamn.com/news/databases/mongodb-graphql
*/



const username = auth["mongodb_user"];
const password = auth["mongodb_password"]
const uri = `mongodb+srv://${username}:${password}@cluster0.g81bj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client_options = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

mongoose
    .connect(uri, client_options)
    .then( () => {
        return mongoose.connection.db.admin().command({ping: 1})
    }).then((result) => {
        console.log("successfully connected to MongoDB: ", result)
    })
    .catch((e) => {
        console.error('Error while connecting to MongoDB:', e);
    })/*.finally(() =>{
        mongoose.disconnect().then(() => {
        console.log("Disconnected from MongoDB.");
        })
    });*/



// define your schemas
const TemperatureTypeDef = gql`
    type Temperature{
        city: String!
        state: String!
        temperature: Float!
        timestamp: String!
    }

    type Query{
        getMostRecentTemperature: [Temperature!]!
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
            return await Weather.aggregate([
                {$sort: {state: 1, city:1, timestamp: -1}},
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
        const result = await Weather.findOne({ city, state }).sort({ timestamp: -1 }).exec();
        console.log("Query result:", result);
        return result;
      },
    },
};

const WindSpeedResolvers = {
    Query: {
      getMostRecentHumidity: async () => {
        return await Weather.aggregate([
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


const typeDefs = mergeTypeDefs([
  TemperatureTypeDef,
  HumidityTypeDefs,
  WindSpeedTypeDefs                           
]);

const resolvers = mergeResolvers([
  HumidityResolvers, 
  TemperatureResolvers, 
  WindSpeedResolvers
]);


// server setup
const server = new ApolloServer({typeDefs, resolvers});

// start the server
server.listen().then(({url}) =>{console.log(`server ready at url: ${url}`)});


