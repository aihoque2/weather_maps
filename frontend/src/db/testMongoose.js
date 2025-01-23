const mongoose = require("mongoose");
const {Weather} = require("./models/Weather.js"); // Adjust this path to point to your Weather model
const auth = require("./auth.json");

const username = auth["mongodb_user"];
const password = auth["mongodb_password"];
const db_name = auth["db_name"];
const uri = `mongodb+srv://${username}:${password}@cluster0.g81bj.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Cluster0`;

const client_options = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


async function testQuery() {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, client_options)
    .then( () => {
        console.log("I pinged!")
        return mongoose.connection.db.admin().command({ping: 1})

    })
    .catch((e) => {
        console.error('Error while connecting to MongoDB:', e);
    });

    console.log("connected to mongodb!")


    let listOfCollections = Object.keys(mongoose.connection.collections);
    console.log("here's the collections: ");
    console.log(listOfCollections);

    let documents = await mongoose.connection.db.collection("weather").find({state: "Missouri"}).toArray();
    console.log("here's some documents: ");
    console.log(documents);

    // Disconnect
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB!");
  } catch (error) {
    console.error("Error during the test query:", error);
  }
}

// Call the function
testQuery();