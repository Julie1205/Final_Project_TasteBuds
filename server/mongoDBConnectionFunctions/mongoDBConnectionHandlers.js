const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const { DATABASE_NAME } = require("../constants/mongoDbConstants");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const client = new MongoClient(MONGO_URI, options);

//creates one MongoDb connection
const connectToMongoDb = async () => {
    try {
        await client.connect();
        return client.db(DATABASE_NAME);
    }
    catch (err) {
        console.log(err.stack);
    }
}

//to close MongoDb connections 
//when you Ctrl+C a running process from the command line.
const closeMongoDb = () => {
    client.close();
    console.info('MongoDB connection closed');
    process.exit();
}

module.exports = { connectToMongoDb,  closeMongoDb }