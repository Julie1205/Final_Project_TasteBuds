const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { DATABASE_NAME, USERS_COLLECTION } = require("./constants/mongoDbConstants");

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};