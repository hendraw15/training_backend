const express = require("express");
const partner = require("./modules/Partners");
require("dotenv").config();
const pg = require("pg");
const { connection } = require("./database/Sequelize");
const sequelize = require("sequelize");

const PORT = 3000;
const app = express();

async function initDB() {
    const pgclient = new pg.Client({
        host: process.env.DB_POSTGRES_HOST,
        user: process.env.DB_POSTGRES_USERNAME,
        password: process.env.DB_POSTGRES_PASSWORD,
        port: process.env.DB_POSTGRES_PORT,
        database: "postgres"
    });

    await pgclient.connect();
    let sqlCheck = `SELECT WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${process.env.DB_POSTGRES_DBNAME}')`;
    let query = await pgclient.query(sqlCheck);

    if (query.rowCount > 0) {
        let createDB = `CREATE DATABASE ${process.env.DB_POSTGRES_DBNAME}`;
        await pgclient.query(createDB);
    }

    console.log("db initiated")
}

initDB().then(async (_) => {
    const models = {
        Users: connection.define(
            "Users", {
            username: { type: sequelize.DataTypes.STRING },
            password: { type: sequelize.DataTypes.STRING },
            }
        ),
        Product: connection.define(
            "Product", {
            name: { type: sequelize.DataTypes.STRING },
            desc: { type: sequelize.DataTypes.STRING },
            }
        ),
        Favorites: connection.define(
            "Favorites", {
            user_id: { type: sequelize.DataTypes.INTEGER },
            product_id: { type: sequelize.DataTypes.INTEGER },
            }
        )
    }

    global.models = models;

    await connection.authenticate();
    await connection.sync({ alter: true });

    app.use(express.json())

    app.get("/", (req, res) => {
        res.send("it just works")
    })

    const router = express.Router();

    partner(router);

    app.use("/api/v1/", router);

    app.listen(PORT, () => {
        console.log(`express sudah berjalan, panggil port ${PORT}`)
    })
})



