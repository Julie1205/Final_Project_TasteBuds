const { USERS_COLLECTION } = require("../constants/mongoDbConstants");
const { v4: uuidv4 } = require("uuid");

//handler to get all the user's restaurants
const getUserRestaurants = async (req, res) => {
    const { email } = req.params;
    const db = req.app.locals.db;

    try {
        const fieldsToReturn = { 
            projection: { 
                _id: 0,
                restaurants: 1
            } 
        }
        const results = await db.collection(USERS_COLLECTION).findOne({email: email}, fieldsToReturn);

        results
            ? res.status(200).json( { status: 200, data: results} )
            : res.status(404).json( {status: 400, data: email, message: "user not found"})
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).json( { status: 500, data: email, message: err.message } );
    }
};

//handler to get one restaurant based on id
const getRestaurant = async (req, res) => {
    const { email, _id } = req.params;
    const db = req.app.locals.db;

    try {
        const results = await db.collection(USERS_COLLECTION).findOne( { email,  "restaurants._id": { $eq: _id } }, { projection: { "restaurants.$": 1} });

        results
            ? res.status(200).json( { status: 200, data: results} )
            : res.status(404).json( {status: 404, data: email, message: "Restaurant not found"})
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).json( { status: 500, data: email, message: err.message } );
    }
};

//add a restaurant to user's restaurants array
const addRestaurant = async (req, res) => {
    const { email } = req.params;
    const db = req.app.locals.db;
    
    const newRestaurantInfo = {
        _id: uuidv4(),
        ...req.body
    }

    if(email && newRestaurantInfo.restaurantName) {

        try {
            const filter = {email: email};
            const updateValue = { $push: {restaurants: newRestaurantInfo} }
            const results = await db.collection(USERS_COLLECTION).updateOne(filter, updateValue);
    
            if(results.matchedCount === 0) {
                res.status(404).json( {status: 404, data: email, message: "User not found."});
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
    }
    else {
        res.status(400).json( {status: 400, data: email, message: "Missing information to identify user."});
    }
};

//removes one restaurant from user's restaurant's array based on id
const deleteRestaurant = async (req,res) => {
    const { email } = req.params;
    const db = req.app.locals.db;
    const { _id } = req.body;

    if(_id){

        try{
            const filter = { email };
            const restaurantToRemove = { $pull: { restaurants: { _id }} }
            const results = await db.collection(USERS_COLLECTION).updateOne(filter, restaurantToRemove);
    
            if(results.matchedCount === 0) {
                res.status(404).json( {status: 404, data: email, message: "User not found."});
            }
            else if(results.matchedCount === 1 && results.modifiedCount === 0) {
                res.status(400).json( {status: 400, data: email, message: "Unable to delete restaurant."});
            }
            else if(results.matchedCount === 1 && results.modifiedCount === 1) {
                res.status(200).json( { status: 200, message: "Restaurant deleted." } )
            }
        }
        catch (err) {
            console.log(err.stack);
            res.status(500).json( { status: 500, data: email, message: err.message } );
        }
    }
    else {
        res.status(400).json( { status: 400, data: _id, message: "Missing information to find saved restaurant." } )
    }
};

const UPDATABLE_FIELDS = [
    "restaurantName",
    "restaurantAddress",
    "restaurantPhoneNumber",
    "restaurantWebsite",
    "restaurantVisitStatus",
    "restaurantCategory",
    "restaurantFavorite",
    "restaurantCuisine",
    "restaurantComment",
    "imageUrl"
];

//update a restaurant in user's restaurant array
const updateRestaurant = async (req, res) => {
    const { email } = req.params;
    const { _id } = req.body;
    const db = req.app.locals.db;

    const fieldsSent = Object.keys(req.body);
    let isfieldAcceptable = false;
    UPDATABLE_FIELDS.forEach((field) => {
        if(!isfieldAcceptable && fieldsSent.includes(field)) {
            isfieldAcceptable = true;
        }
    });
    
    if(email && _id && isfieldAcceptable) {
        
        try {
            const filter = { email };
            const restaurantToUpdate = { arrayFilters: [ {"restaurantSelected._id": _id} ] };
            let valuesToUpdate = { $set: {} };
            
            UPDATABLE_FIELDS.forEach((field) => {
                if(req.body[field] !== undefined) {
                    valuesToUpdate.$set[`restaurants.$[restaurantSelected].${field}`] = req.body[field];
                } 
            });
            
            const results = await db.collection(USERS_COLLECTION).updateOne(filter, valuesToUpdate, restaurantToUpdate);
            
            if(results.matchedCount === 0) {
                res.status(404).json( {status: 404, data: { email, updateInfo: req.body }, message: "User not found."});
            }
            else if(results.matchedCount === 1 && results.modifiedCount === 0) {
                res.status(400).json( {status: 400, data: { email, updateInfo: req.body }, message: "Unable to update restaurant."});
            }
            else if(results.matchedCount === 1 && results.modifiedCount === 1) {
                res.status(200).json( { status: 200, message: "Restaurant updated." } )
            }
        }
        catch (err) {
            console.log(err.stack);
            res.status(500).json( { status: 500, data: email, message: err.message } );
        }
    }
    else {
        res.status(400).json( { status: 400, data: { email, _id, updatedvalue: req.body }, message: "Missing information to find user or update restaurant" } )
    }
};

module.exports = { getUserRestaurants, getRestaurant, addRestaurant, deleteRestaurant, updateRestaurant }