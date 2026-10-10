const auth = require("./auth.json")
const {ApolloServer, gql} = require("apollo-server");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const { mergeResolvers } = require("@graphql-tools/merge");
const {WeatherCity, WeatherZip} = require("./models/Weather.js"); // module.exports
const mongoose = require("mongoose");

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
const WeatherTypeDef = gql`
    type WeatherLocation{
        city: String
        state: String!
        zip: String
        lat: Float
        lon: Float
    }
    
    type WeatherObservation{
        location: WeatherLocation!
        temperature: Float!
        humidity: Float!
        wind_speed: Float!
        time: String!
    }
    
    type HumidityAvg {
        state: String!
        humidity: Float
    }
    
    type WindSpeedAvg{
        state: String!
        wind_speed: Float
    }

    type TemperatureAvg{
        state: String!
        temperature: Float
    }
    
    type Query{
        getMostRecentWeatherByCity(city: String!, state: String!): WeatherObservation
        getMostRecentWeatherByZip(zip: String!): WeatherObservation
        getAvgHumidityByState(state: String!): HumidityAvg
        getAvgWindSpeedByState(state: String!): WindSpeedAvg
        getAvgTemperatureByState(state: String!): TemperatureAvg

    }
`

/*
this type is to get all the unique
zip codes inserted to mongoDB

*/
const ZipCodeTypeDef = gql`
    type ZipWeatherPoint {
        zip: String!
        state: String!
        city: String
        lat: Float!
        lon: Float!

        temperature: Float!
        humidity: Float!
        wind_speed: Float!
        time: String!
    }

    type Query {
        getAllZipWeather: [ZipWeatherPoint!]!
    }
`

const WeatherResolvers = {
    Query: {
        getMostRecentWeatherByCity: async (_,{city, state}) =>{
            try{
                const result = await WeatherCity.findOne({ city, state }).sort({ time: -1 }).exec();
                console.log("Query result:", result);
                return {
                    location: {
                        city: result.city,
                        state: result.state,
                        zip: null,
                        lat: null,
                        lon: null
                    },

                    temperature: result.temperature,
                    humidity: result.humidity,
                    wind_speed: result.wind_speed,
                    time: result.time
                };
            }
            catch(err){
                console.error("Error fetching wether:", err);
                throw new Error("Error fetching weather data.");
        
            }
        },
        getMostRecentWeatherByZip: async (_,{zip}) =>{
            try{
                const result = await WeatherZip.findOne({ zip }).sort({ time: -1 }).exec();
                console.log("Query result:", result);
                return result;
            }
            catch(err){
                console.error("Error fetching wether:", err);
                throw new Error("Error fetching weather data.");
        
            }
        },
        getAvgHumidityByState: async (_, {state}) => {
                try {
                    const result = await WeatherCity.aggregate([
                        { $match: { state } },
                        { $sort: { time: -1 } },
                        { $group: {
                            _id: "$city",
                            humidity: { $first: "$humidity" }
                        }},
                        { $group: {
                            _id: null,
                            avgHumidity: { $avg: "$humidity" }
                        }}
                    ]);
                    return { state, humidity: result[0]?.avgHumidity };
                }
                catch(err) {
                    console.error("Error fetching avg humidity:", err);
                    throw new Error("Error fetching avg humidity data.");
                }
        },
        getAvgWindSpeedByState: async (_, {state}) => {
            try {
                const result = await WeatherCity.aggregate([
                    { $match: { state } },
                    { $sort: { time: -1 } },
                    { $group: {
                        _id: "$city",
                        wind_speed: { $first: "$wind_speed" }
                    }},
                    { $group: {
                        _id: null,
                        avgWindSpeed: { $avg: "$wind_speed" }
                    }}
                ]);
                return { state, wind_speed: result[0]?.avgWindSpeed };
            }
            catch(err) {
                console.error("Error fetching avg wind_speed:", err);
                throw new Error("Error fetching avg wind_speed data.");
            }
        },
        getAvgTemperatureByState: async (_, {state}) => {
            try {
                const result = await WeatherCity.aggregate([
                    { $match: { state } },
                    { $sort: { time: -1 } },
                    { $group: {
                        _id: "$city",
                        temperature: { $first: "$temperature" }
                    }},
                    { $group: {
                        _id: null,
                        avgTemperature: { $avg: "$temperature" }
                    }}
                ]);
                return { state, temperature: result[0]?.avgTemperature };
            }
            catch(err) {
                console.error("Error fetching avg temperature:", err);
                throw new Error("Error fetching avg temperature data.");
            }
        },    }
}

const ZipCodeResolvers = {
    Query: {
        getAllZipWeather: async () => {
            try {
                const result = await WeatherZip.aggregate([
                    /*
                    Remove documents that cannot be plotted.
                    (null-valued docs suck)
                    */
                    {
                        $match: {
                            zip: { $ne: null },
                            state: { $ne: null },
                            lat: { $ne: null },
                            lon: { $ne: null },
                            temperature: { $ne: null },
                            humidity: { $ne: null },
                            wind_speed: { $ne: null }
                        }
                    },

                    /*
                    Group records by ZIP, newest first.

                    Example:

                    15213  Sept 29 21:00
                    15213  Sept 29 20:00
                    15213  Sept 29 19:00

                    15217  Sept 29 21:00
                    15217  Sept 29 20:00
                    */
                    {
                        $sort: {
                            zip: 1,
                            time: -1
                        }
                    },

                    /*
                    One group per unique ZIP.

                    Because we sorted newest-first,
                    $first gives us the newest usable record.
                    */
                    {
                        $group: {
                            _id: "$zip",

                            zip: { $first: "$zip"},
                            state: { $first: "$state" },
                            lat: { $first: "$lat" },
                            lon: { $first: "$lon" },
                            temperature: { $first: "$temperature" },
                            humidity: { $first: "$humidity" },
                            wind_speed: { $first: "$wind_speed" },
                            time: { $first: "$time" }
                        }
                    },

                    /*
                    Don't send Mongo's grouping _id
                    to the frontend.
                    */
                    {
                        $project: {
                            _id: 0,
                            zip: 1,
                            state: 1,
                            lat: 1,
                            lon: 1,
                            temperature: 1,
                            humidity: 1,
                            wind_speed: 1,
                            time: 1
                        }
                    }
                ]);

                console.log(
                    `Found ${result.length} unique ZIP codes`
                );

                return result;
            }
            catch (err) {
                console.error(
                    "Error fetching ZIP codes:",
                    err
                );

                throw new Error(
                    "Error fetching ZIP code data."
                );
            }
        }
    }
};

const typeDefs = mergeTypeDefs([
    WeatherTypeDef,      
    ZipCodeTypeDef                    
]);

const resolvers = mergeResolvers([
    WeatherResolvers,
    ZipCodeResolvers
]);


// server setup
const server = new ApolloServer({typeDefs, resolvers});

// start the server
server.listen().then(({url}) =>{console.log(`server ready at url: ${url}`)});

