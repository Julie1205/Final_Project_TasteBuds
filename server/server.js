const express = require("express");
const morgan = require("morgan");

const { 
    connectToMongoDb,  
    closeMongoDb 
} = require("./mongoDBConnectionFunctions/mongoDBConnectionHandlers");

const { 
    getRestaurantsNearMe, 
    findRestaurant 
} = require("./handlers/api_handlers");

const { 
    getUserRestaurants, 
    getRestaurant, 
    addRestaurant, 
    deleteRestaurant, 
    updateRestaurant 
} = require("./handlers/restaurants_handlers");

const { getUser } = require("./handlers/user_handlers");
const { deleteImage } = require("./handlers/image_handlers");

const app = express();
const port = 8000;

app.use(morgan("tiny"));
app.use(express.json());

//restaurant search endpoints
app.get("/get-restaurants-near-me/:address", getRestaurantsNearMe);
app.get("/get-find-restaurant/:restaurantName/:city", findRestaurant);

//user restaurants endpoints
app.get("/get-user-restaurants/:email/:category", getUserRestaurants);
app.get("/get-restaurant/:email/:_id", getRestaurant);
app.post("/add-restaurant/:email", addRestaurant);
app.patch("/update-restaurant/:email", updateRestaurant);
app.delete("/delete-restaurant/:email", deleteRestaurant);

//user profile endpoints
app.get("/get-user/:email", getUser)

//cloudinary images endpoints
app.delete("/delete-image", deleteImage)

//catch all other endpoints
app.get("*", (req, res) => {
    res.status(404).json({
    status: 404,
    message: "Page does not exist.",
    });
})

//connect to mongoDb
//connection is passed to handlers via app.locals
//initialize app once database is connected
connectToMongoDb()
.then(db => {
        app.locals.db = db;
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })

//close connection to MongoDb 
process.on('SIGINT', closeMongoDb);
process.on('SIGTERM', closeMongoDb);