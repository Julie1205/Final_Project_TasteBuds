const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const { DATABASE_NAME, USERS_COLLECTION } = require("../constants/mongoDbConstants");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const getUser = async (req, res) => {
        const { email } = req.params;
    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const results = await db.collection(USERS_COLLECTION).findOne({email: email}, { projection: { email: 1, username: 1 } });

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

module.exports = { getUser }