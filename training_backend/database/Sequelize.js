const sequelize = require("sequelize");

const connection = new sequelize.Sequelize(
    process.env.DB_POSTGRES_DBNAME,
    process.env.DB_POSTGRES_USERNAME,
    process.env.DB_POSTGRES_PASSWORD, {
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT,
    dialect: 'postgres',
    logging: false
})

module.exports.connection = connection;