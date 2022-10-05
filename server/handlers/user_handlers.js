const { USERS_COLLECTION } = require("../constants/mongoDbConstants");


const getUser = async (req, res) => {
    const { email } = req.params;
    const db = req.app.locals.db;

    try {
        const results = await db.collection(USERS_COLLECTION).findOne({email: email}, { projection: { email: 1, username: 1 } });

        results
            ? res.status(200).json( { status: 200, data: results} )
            : res.status(404).json( {status: 400, data: email, message: "user not found"})
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).json( { status: 500, data: email, message: err.message } );
    }
}

module.exports = { getUser }