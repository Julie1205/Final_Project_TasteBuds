const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

app.use(morgan("tiny"))

app.get('/', (req, res) => {
    res.status(200).json({status: 200})
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});