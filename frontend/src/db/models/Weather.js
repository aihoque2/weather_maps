const mongoose = require("mongoose");   

const weatherSchema = new mongoose.Schema({
    city: String,
    state: String,
    temperature: Number,
    humidity: Number,
    wind_speed: Number,
    timestamp: Date,
});
  
module.exports = mongoose.model("weather_data", weatherSchema);