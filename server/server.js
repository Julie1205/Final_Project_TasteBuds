const express = require("express");
const morgan = require("morgan");
const { getRestaurantsNearMe } = require("./handlers");
const app = express();
const port = 8000;

app.use(morgan("tiny"));
app.use(express.json());

//test endpoint
// app.get("/api/hello", (req, res) => {
//     res.status(200).json({status: 200, message: "hi"});
// });

//get restaurants near me endpoint
app.get("/get-restaurants-near-me/:address", getRestaurantsNearMe);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});