const express = require('express');
const app = express();

const port = 8000;

app.get("/", (req, res) => {
    res.json({message: "hello from the server side", statusCode: 200});
})

app.post("/", (req, res) => {
    res.send("Posting the data")
})

app.listen(port, () => {
    console.log(`app is running on port ${port}...`);
})