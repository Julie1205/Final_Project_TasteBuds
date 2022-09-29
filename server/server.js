const express = require("express");
const morgan = require("morgan");
const { getRestaurantsNearMe, findRestaurant } = require("./api_handlers");
const app = express();
const port = 8000;

app.use(morgan("tiny"));
app.use(express.json());

//restaurant search endpoints
app.get("/get-restaurants-near-me/:address", getRestaurantsNearMe);
app.get("/get-find-restaurant/:restaurantName/:city", findRestaurant);

app.get("*", (req, res) => {
    res.status(404).json({
    status: 404,
    message: "Page does not exist.",
    });
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});