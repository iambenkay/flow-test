const Sequelize = require('sequelize')
const sequelize = require('../db/cursor')
const Assessment = require("./Assessment")
const Record = require("./Record")

class User extends Sequelize.Model {}

User.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    authPassword: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isStaff: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isSuperUser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {sequelize, tableName: 'users'})



User.hasMany(Assessment)
User.hasMany(Record)

module.exports = User
