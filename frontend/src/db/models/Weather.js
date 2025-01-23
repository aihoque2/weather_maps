const mongoose = require("mongoose");   

const weatherSchema = new mongoose.Schema({
    city: String,
    state: String,
    temperature: Number,
    humidity: Number,
    wind_speed: Number,
    time: Date,
}, {collection: 'weather'});
  
const Weather = mongoose.model("weather", weatherSchema);

module.exports = {Weather}