const mongoose = require("mongoose");   

// A "Schema" defines the shape of documents in a MongoDB collection.
// Think of it like a table definition in SQL — it tells MongoDB what 
// fields each document should have and what types they are.
const weatherCitySchema = new mongoose.Schema({
    city: String,        // e.g. "St. Louis"
    state: String,       // e.g. "Missouri"
    temperature: Number, // in whatever unit your data pipeline stores (F, C, K)
    humidity: Number,    // typically a percentage 0-100
    wind_speed: Number,  // e.g. mph or km/h
    time: Date,          // timestamp of the reading - used for sorting to get "most recent"
}, 
// By default mongoose would look for a collection named "weathers" (pluralized).
// This overrides that and tells mongoose to use the collection literally named "weather".
{collection: 'weather_city'});

const weatherZipSchema = new mongoose.Schema({
    zip: {
        type: String,
        match: /^\d{5}$/,  // exactly 5 digits, rejects anything else
        required: true,
    },        // e.g. "63110"
    state: String,       // e.g. "Missouri"
    temperature: Number, // in whatever unit your data pipeline stores (F, C, K)
    humidity: Number,    // typically a percentage 0-100
    wind_speed: Number,  // e.g. mph or km/h
    time: Date,          // timestamp of the reading - used for sorting to get "most recent"
}, 
// By default mongoose would look for a collection named "weathers" (pluralized).
// This overrides that and tells mongoose to use the collection literally named "weather".
{collection: 'weather_zip'});
  
// mongoose.model() compiles the schema into a Model.
// A Model is the class you actually use to interact with the collection —
// Weather.findOne(), Weather.find(), Weather.save(), etc. all come from this.
// First arg is the model name (used internally by mongoose), second is the schema.
const WeatherCity = mongoose.model("weather_city", weatherCitySchema);
const WeatherZip = mongoose.model("weather_zip", weatherZipSchema);

// Export the model so other files (like server.js) can import and use it.
module.exports = {WeatherCity, WeatherZip}