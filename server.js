const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

//Host, user, password database
const connection = mysql.createConnection({
    //process.env.KEYWORD
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
});


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/pokemon", (req, res) => {
    res.send("Here are all the Pokemon");
});

app.get("/test", (req, res)=>{
    connection.query("SELECT * FROM pokemon", (error, results)=>{
        console.log(results)
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});