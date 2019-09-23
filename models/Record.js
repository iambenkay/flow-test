const Sequelize = require('sequelize')
const sequelize = require('../db/cursor')

class Record extends Sequelize.Model {}

Record.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    solutions: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
    },
    expires: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    submitted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    started: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    score: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    passed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    }
}, {sequelize, tableName: 'records'})

module.exports = Record
