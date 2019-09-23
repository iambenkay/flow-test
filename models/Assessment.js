const Sequelize = require('sequelize')
const sequelize = require('../db/cursor')
const Record = require('./Record')

class Assessment extends Sequelize.Model {}

Assessment.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    noOfQuestions: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    passPercent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 70,
    },
    questions: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
    },
    duration: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 60,
    }
}, {sequelize, tableName: 'assessments'})

Assessment.hasMany(Record)

module.exports = Assessment
