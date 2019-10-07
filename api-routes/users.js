const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")

router.route("/")
    .get((req, res) => {
        User.find({}, null, {lean:true})
        .then(users => {
            return res.send(users.map(user => {
                const {_id, firstName, lastName, email} = user
                return {_id, firstName, lastName, email}
            }))
        })
        .catch(() => {
            return res.status(404).send({error: "Something went wrong"})
        })
    })
    .post(async (req, res) => {
        const {
            firstName,
            lastName,
            email,
            authPassword,
        } = req.body
        if(!(firstName &&
            email &&
            lastName &&
            authPassword))
        {
            const error = "You must provide all 4 properties to " +
            "create a user: (firstName, lastName, authPassword, email)"
            return res.status(400).send({error})
        }
        salt = await bcrypt.genSalt(10)
        hash = await bcrypt.hash(authPassword, salt)
        User.create({
            firstName,
            lastName,
            email,
            authPassword: hash,
        })
        .then(user => {
            const {_id, firstName, lastName, email} = user
            return res.status(201).send({_id, firstName, lastName, email})
        })
        .catch(() => {
            const error = "Cannot create resource"
            return res.status(500).send({ error })
        })
    })

module.exports = router
