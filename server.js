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

// alle pokemon
app.get("/all/pokemon", (req, res)=>{
    connection.query("SELECT * FROM pokemon", (error, results)=>{
        res.json(results);
    })
})


// alle trænere
app.get("/all/trainers", (req, res) =>{
    connection.query("SELECT * FROM trainer", (error, results) => {
        res.json(results)
    })
})

// alle trænere med deres pokemon
app.get("/all/trainers/withPokemon", (req, res) =>{
    connection.query("SELECT name, trainer_name FROM pokemon INNER JOIN trainer_pokemon ON pokemon.pokedex_number = trainer_pokemon.pokedex_number INNER JOIN trainer ON trainer.trainer_id = trainer_pokemon.trainer_id", (error, results) =>{
    res.json(results)
})
})


app.get("/test", (req, res)=>{
    connection.query("SELECT * FROM pokemon", (error, results)=>{
        console.log(results)
    })
})



//Her kan man tilføje en ny trainer
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

// her kan man fetch en ny trainer
fetch("http://localhost:3000/trainer/new/?name=Ash&hometown=PalletTown&age=10")
    .then(response => response.text())
    .then(data => {
        console.log(data);
    });


//Her kan man tilføje en pokemon til en trainer
app.post("/trainer/catch", (req, res) => {
    const trainer_id = req.body.trainer_id;
    const pokedex_number = req.body.pokedex_number;

    connection.query(
        "INSERT INTO trainer_pokemon (trainer_id, pokedex_number) VALUES (?, ?)",
        [trainer_id, pokedex_number],
        (error, results) => {
            res.send("Pokemon was caught");
        }
    );
});

//her kan man fetch en ny trainer
fetch("http://localhost:3000/trainer/catch?trainer_id=1&pokedex_number=25", {
    method: "POST"
})
    .then(response => response.text())
    .then(data => {
        console.log(data);
    });




app.listen(3000, () => {
    console.log("Server is running on port 3000");
});