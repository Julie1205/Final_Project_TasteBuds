const { MongoClient } = require("mongodb");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const { MONGO_URI } = process.env;
const { DATABASE_NAME, USERS_COLLECTION } = require("./constants/mongoDbConstants");

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const getUserRestaurants = async (req, res) => {
    const { email } = req.params;
    const client = new MongoClient(MONGO_URI, mongoOptions);

    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const results = await db.collection(USERS_COLLECTION).findOne({email: email}, { projection: { _id: 0, restaurants: 1 } });

        results
            ? res.status(200).json( { status: 200, data: results} )
            : res.status(404).json( {status: 400, data: email, message: "user not found"})
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).json( { status: 500, data: email, message: err.message } );
    }
    finally {
        client.close();
    }
}

//to add check for duplicates
const addRestaurant = async (req, res) => {
    const { email } = req.params;
    const newRestaurantInfo = {
        _id: uuidv4(),
        ...req.body
    }

    if(email && newRestaurantInfo.restaurantName) {
        const client = new MongoClient(MONGO_URI, mongoOptions);
        try {
            await client.connect();
            const db = client.db(DATABASE_NAME);
            const filter = {email: email};
            const updateValue = { $push: {restaurants: newRestaurantInfo} }
            const results = await db.collection(USERS_COLLECTION).updateOne(filter, updateValue);
    
            if(results.matchedCount === 0) {
                res.status(404).json( {status: 404, data: email, message: "User not found"});
            }
            else if(results.matchedCount === 1 && results.modifiedCount === 0) {
                res.status(400).json( {status: 400, data: email, message: "Unable to add restaurant. Information is the same in database."});
            }
            else if(results.matchedCount === 1 && results.modifiedCount === 1) {
                res.status(201).json( { status: 201, message: "Restaurant added." } )
            }
        }
        catch (err) {
            console.log(err.stack);
            res.status(500).json( { status: 500, data: email, message: err.message } );
        }
        finally {
            client.close();
        }
    }
    else {
        res.status(400).json( {status: 400, data: email, message: "Missing information to identify user"});
    }
}

module.exports = { getUserRestaurants, addRestaurant }