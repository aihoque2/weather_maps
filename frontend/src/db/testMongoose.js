const mongoose = require("mongoose");
const Weather = require("./models/Weather.js"); // Adjust this path to point to your Weather model
const auth = require("./auth.json");

const username = auth["mongodb_user"];
const password = auth["mongodb_password"];
const uri = `mongodb+srv://${username}:${password}@cluster0.g81bj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client_options = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


async function testQuery() {
  try {
    // Connect to MongoDB
mongoose
    .connect(uri, client_options)
    .then( () => {
        return mongoose.connection.db.admin().command({ping: 1})
    }).then((result) => {
        console.log("successfully connected to MongoDB: ", result);
        Weather.findOne({state: "Missouri"}).then((res)=>{
            console.log("insitde then result: ", res)
        })
    })
    .catch((e) => {
        console.error('Error while connecting to MongoDB:', e);
    });

    // Run a sample query
    const result = await Weather.findOne({state: "Missouri"});
    console.log("Query result:", result);

    // Disconnect
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB!");
  } catch (error) {
    console.error("Error during the test query:", error);
  }
}

// Call the function
testQuery();