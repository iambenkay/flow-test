const Sequelize = require("sequelize")

const env = (process.env.APP_ENV === 'production') ? true : false

const cursor = (!env)
    ? new Sequelize("benkay", "benkay", "Benjamin123$", {
        host: "localhost",
        dialect: "postgres",
    })
    : new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: "postgres",
    })

cursor.authenticate()
    .then(() => {
        console.log("Database connection established successfully")
    })
    .catch(e => {
        console.error("There was an error while connecting to the database: ", e)
    })

module.exports = cursor
