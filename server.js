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


app.get("/all/pokemon", (req, res)=>{
    connection.query("SELECT * FROM pokemon", (error, results)=>{
        res.json(results);
    })
})


app.get("/pokemon", (req, res) => {
    res.send("Here are all the Pokemon");
});

app.get("/test", (req, res)=>{
    connection.query("SELECT * FROM pokemon", (error, results)=>{
        console.log(results)
    })
})




app.post("/trainer/new/", (req, res) => {
    const name = req.body.name;
    const hometown = req.body.hometown;
    const age = req.body.age;

    connection.query(
        "INSERT INTO trainer (trainer_name, hometown, age) VALUES (?, ?, ?)",
        [name, hometown, age],
        (error, results) => {
            res.send("Trainer created");
        }
    );
});





app.listen(3000, () => {
    console.log("Server is running on port 3000");
});