const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    connection.query("SELECT * FROM pokemon INNER JOIN moves ON pokemon.pokedex_number = moves.pokemon_pokedex_number INNER JOIN first_appearance ON first_appearance.first_appearance_id = pokemon.first_appearance_id", (error, results)=> {
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
    const type = req.query.primary_type || '%'
    const minAttack = req.query.minAttack || 0
    const pokemonName = '%' + (req.query.name || '') + '%'
    const minHp = req.query.hp || 0
    const orderByAttack = req.query.sorter_attack || 'ASC'
    let sorting = 'ASC'
    if(orderByAttack === 'DESC') {
        sorting = 'DESC'
    }
        connection.query('SELECT * FROM pokemon WHERE primary_type LIKE ? AND attack >= ? AND name LIKE ? AND hp >= ? ORDER BY attack ' + sorting, [type, minAttack, pokemonName, minHp], (error, results) => {
            res.send(results)

        })
})


// top 3 strongest pokemon
app.get('/top3strongest', (req, res)=>{
    const query = "SELECT name, (speed + attack + hp + defence + special_attack + special_defence) AS totalStat FROM pokemon ORDER BY totalStat DESC LIMIT 3";

    connection.query(query, (error, result) =>{
        res.json(result);
    });
});


//top 3 weakest pokemon
app.get('/top3weakest', (req, res) => {
    const query = "SELECT name, (speed + attack + hp + defence + special_attack + special_defence) AS totalStat2 FROM pokemon ORDER BY totalStat2 ASC LIMIT 3";

    connection.query(query, (error, result) =>{
        res.json(result);
    });
});

//which bodytype has the highest average stats?
app.get('/typeHighestAvgStat', (req, res) => {
    const query = `SELECT body_shape.type, AVG(pokemon.speed + pokemon.attack + pokemon.hp + pokemon.defence + pokemon.special_attack + pokemon.special_defence) AS averageStat FROM pokemon JOIN body_shape ON pokemon.body_shape_id = body_shape.body_shape_id GROUP BY body_shape.type ORDER BY averageStat DESC LIMIT 3`;

    connection.query(query, (error, result) => {
        let resultatListe = [];

        for (let i = 0; i < result.length; i++) {
            resultatListe.push({
                type: result[i].type,
                averageStat: result[i].averageStat
            });
        }
        res.json(resultatListe);
    });
});


app.get("/bodytypes", (req, res) => {
    connection.query("SELECT name, type FROM pokemon INNER JOIN body_shape ON pokemon.body_shape_id = body_shape.body_shape_id", (error, results)=>{
        console.log(results)
        res.send(results)})
})

// 5 mest balancerede pokemon
app.get("/pokemon/mostBalanced", (req, res) => {
    connection.query("SELECT pokedex_number, name, (speed + attack + defence + hp + special_defence + special_attack) / 6 AS average_stats, GREATEST(speed, attack, defence, hp, special_defence, special_attack) - LEAST(speed, attack, defence, hp, special_defence, special_attack) AS stat_range FROM pokemon ORDER BY stat_range ASC LIMIT 3", (error, results) => {
        res.json(results)
    })
})

// hvilken træner har flest pokemonnn
app.get("/trainer/mostPokemon", (req, res)=> {
    connection.query("SELECT trainer.trainer_name, COUNT(*) AS pokemon_count FROM pokemon INNER JOIN trainer_pokemon ON pokemon.pokedex_number = trainer_pokemon.pokedex_number  INNER JOIN trainer ON trainer.trainer_id = trainer_pokemon.trainer_id GROUP BY trainer.trainer_id, trainer.trainer_name ORDER BY pokemon_count DESC LIMIT 1", (error, results) => {
        res.json(results)
    })
})

// søge efter specifikt primary og secondary types
    app.get("/pokemon/specificTypes", (req, res) => {
        const primaryType = req.query.primary_type;
        const secondaryType = req.query.secondary_type;
        connection.query("SELECT * FROM pokemon WHERE primary_type = ? AND secondary_type = ?",
            [primaryType, secondaryType], (error, results) => {
                res.json(results)
    })
})


    app.listen(3000, () => {
    console.log("Server is running on port 3000");
});