const express = require('express');
const fs = require("fs");
const app = express();


const port = 8000;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`));

// app.get("/", (req, res) => {
//     res.json({message: "hello from the server side", statusCode: 200});
// })

// app.post("/", (req, res) => {
//     res.send("Posting the data")
// })

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours
        }
    })
});

app.listen(port, () => {
    console.log(`app is running on port ${port}...`);
})