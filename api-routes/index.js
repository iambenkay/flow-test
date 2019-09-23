const router = require("express").Router()
const passport = require('passport')
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authenticator = passport.authenticate('jwt', {session: false})
const isAdmin = (req, res, next) => {
    if(!req.get("authorization")) return res.status(401).send({"message": "You are not authorized to access this route"})
    token = req.get("authorization").split(" ")[1]
    payload = jwt.decode(token)
    User.findByPk(payload.id)
    .then(user => {
        if(user && user.isStaff && user.isSuperUser) return next()
        else res.status(401).send({"message": "You are not authorized to access this route"})
    })
}
const isAuthenticated = (req, res, next) => {
    console.log(req.method)
    if(!req.get("authorization")) return res.status(401).send({"message": "You are not authorized to access this route"})
    token = req.get("authorization").split(" ")[1]
    payload = jwt.decode(token)
    console.log(payload)
    User.findByPk(payload.id)
    .then(user => {
        if(user) return next()
        else res.status(401).send({"message": "You are not authorized to access this route"})
    })
}

router.use(require("./auth"))
router.use("/users", require("./users"))
router.use("/questions", require("./questions"))
router.use("/assessments", require("./assessments"))
router.use(require("./records"))

module.exports = router
