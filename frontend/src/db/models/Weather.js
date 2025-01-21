const mongoose = require("mongoose");   

const weatherSchema = new mongoose.Schema({
    city: String,
    state: String,
    temperature: Number,
    humidity: Number,
    wind_speed: Number,
    timestamp: Date,
},{
    collection: 'weather' // Use the exact collection name here
});
  
module.exports = mongoose.model("weather", weatherSchema);