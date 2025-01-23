const auth = require("./auth.json")
const {ApolloServer, gql} = require("apollo-server");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const { mergeResolvers } = require("@graphql-tools/merge");
const {Weather} = require("./models/Weather.js"); // module.exports
const {mongoose} = require("mongoose");

/*
TODO: use this guy's code for reference:
https://codedamn.com/news/databases/mongodb-graphql
*/



const username = auth["mongodb_user"];
const password = auth["mongodb_password"]
const db_name = auth["db_name"];
const uri = `mongodb+srv://${username}:${password}@cluster0.g81bj.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Cluster0`;
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
        time: String!
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
        time: String!
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
        time: String!
    }

    type Query{
        getMostRecentWindSpeed: [WindSpeed!]
    }
`;

const TemperatureResolvers = {
    Query:{
        getMostRecentTemperature: async() =>{
            return await Weather.aggregate([
                {$sort: {state: 1, city:1, time: -1}},
                {
                    $group: {
                        _id: "$city",
                        city: {$first: "$city"},
                        state: {$first: "$state"},
                        temperature: {$first: "$temperature"},
                        time: {$first: "$time"}
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
        try{
            const result = await Weather.findOne({ city, state }).sort({ time: -1 }).exec();
            console.log("Query result:", result);
            return result;
        }
        catch{
            console.error("Error fetching humidity:", err);
            throw new Error("Error fetching humidity data.");
    
        }
      },
    },
};

const WindSpeedResolvers = {
    Query: {
      getMostRecentWindSpeed: async () => {
        return await Weather.aggregate([
          { $sort: { state: 1, city: 1, time: -1 } },
          {
            $group: {
              _id: "$city",
              city: { $first: "$city" },
              state: { $first: "$state" },
              wind_speed: { $first: "$wind_speed" },
              time: { $first: "$time" },
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


