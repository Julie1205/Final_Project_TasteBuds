const express = require("express");
const morgan = require("morgan");
const { getRestaurantsNearMe, findRestaurant } = require("./api_handlers");
const { getUserRestaurants, getRestaurant, addRestaurant, deleteRestaurant, updateRestaurant } = require("./restaurants_handlers");
const { getUser } = require("./user_handlers");
const app = express();
const port = 8000;

app.use(morgan("tiny"));
app.use(express.json());

//restaurant search endpoints
app.get("/get-restaurants-near-me/:address", getRestaurantsNearMe);
app.get("/get-find-restaurant/:restaurantName/:city", findRestaurant);

//user restaurants endpoints
app.get("/get-user-restaurants/:email", getUserRestaurants);
app.get("/get-restaurant/:email/:_id", getRestaurant);
app.post("/add-restaurant/:email", addRestaurant);
app.patch("/update-restaurant/:email", updateRestaurant);
app.delete("/delete-restaurant/:email", deleteRestaurant);

//user profile endpoints
app.get("/get-user/:email", getUser)

app.get("*", (req, res) => {
    res.status(404).json({
    status: 404,
    message: "Page does not exist.",
    });
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});