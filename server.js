const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/pokemon", (req, res) => {
    res.send("Here are all the Pokemon");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});