const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 8000;

app.use(morgan("tiny"));
app.use(express.json());

app.get("/api/hello", (req, res) => {
    res.status(200).json({status: 200, message: "hi"});
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});