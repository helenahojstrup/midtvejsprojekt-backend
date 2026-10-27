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










//api - filtrering af diverse kriterier
app.get('/pokemon/filters', (req, res) => {

})





















// top 3 strongest pokemon
app.get('/top3strongest', (req, res)=>{
    const query = "SELECT name, (speed + attack + hp + defence + special_attack + special_defence) AS totalStat FROM pokemon ORDER BY totalStat DESC LIMIT 3";

    connection.query(query, (error, result) =>{
        let resultat = "";

        for (let i = 0; i < result.length; i++) {
            const totalStat = result[i].totalStat;

            if (totalStat > 500) {
                resultat += `${i + 1}. ${result[i].name} total stat = ${totalStat}<br>`;
            }
        }
        res.send(resultat);
    });
});


//top 3 weakest pokemon
app.get('/top3weakest', (req, res) => {
    const query = "SELECT name, (speed + attack + hp + defence + special_attack + special_defence) AS totalStat FROM pokemon ORDER BY totalStat ASC LIMIT 3";

    connection.query(query, (error, result) =>{
        let resultat2 = "";

        for (let i = 0; i < result.length; i++) {
            const totalStat = result[i].totalStat;

            resultat2 += `${i + 1}. ${result[i].name} total stat = ${totalStat}<br>`;
        }
        res.send(resultat2);
    });
});

//which bodytype has the highest average stats?
app.get('/typeHighestAvgStat', (req, res) => {
    const query = `SELECT body_shape.type, AVG(pokemon.speed + pokemon.attack + pokemon.hp + pokemon.defence + pokemon.special_attack + pokemon.special_defence) AS averageStat FROM pokemon JOIN body_shape ON pokemon.body_shape_id = body_shape.body_shape_id GROUP BY body_shape.type ORDER BY averageStat DESC LIMIT 1`;

    connection.query(query, (error, result) => {
        let resultat3 = "";

        for (let i = 0; i < result.length; i++) {
            const averageStat = result[i].averageStat;

            resultat3 += `body type: ${result[i].type} AVG stat = ${averageStat}`;
        }
        res.send(resultat3);
    });
});





























app.get("/bodytypes", (req, res) => {
    connection.query("SELECT name, type FROM pokemon INNER JOIN body_shape ON pokemon.body_shape_id = body_shape.body_shape_id", (error, results)=>{
        console.log(results)
        res.send(results)})
})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});