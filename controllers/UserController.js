const Sequelize = require('sequelize')
const User = require('../models/User')
const cb = require("./base")

const getUser = (req, res) => {
    const { id } = req.params

    User.findByPk(id)
        .then(user => cb.getCallback(user, res))
        .catch(() => cb.errorCallback(res))
}

const deleteUser = (req, res) => {
    const { id } = req.params

    User.destroy({
        where: {id},
    })
    .then(user => cb.deleteCallback(user, "User", res))
    .catch(() => cb.errorCallback(res))
}

const createUser = (req, res) => {
    const {
        firstName,
        lastName,
        email,
        authPassword,
    } = req.body
    console.log(req.body);
    if(!(firstName &&
        email &&
        lastName &&
        authPassword))
    {
        const message = "You must provide all 4 properties to " +
        "create a user: (firstName, lastName, authPassword, email)"
        return res.status(400).send({message})
    }
    User.create({
        firstName,
        lastName,
        email,
        authPassword,
    })
    .then(user => cb.postCallback(user, res))
    .catch(() => cb.postErrorCallback(res))
}

const getUsers = (req, res) => {
    User.findAll()
    .then(users => cb.listCallback(users, res))
    .catch(() => cb.listErrorCallback(res))
}

module.exports = {getUser, getUsers, createUser, deleteUser}
