const decode = require("./decode")
const User = require("../models/User")

module.exports.isAdmin = async (req, res, next) => {
    if(!req.get("authorization") || !req.get("authorization").startsWith("Bearer "))
        return res.status(401).send({error: "You are not authorized to access this route"})
    const token = req.get("authorization").split(" ")[1]
    const payload = decode(token)
    const user = await User.findById(payload.id)
    if(user && user.isStaff && user.isSuperUser){
        req.payload = {id: user._id, isStaff: user.isStaff, isSuperUser: user.isSuperUser}
        return next()
    }
    return res.status(401).send({error: "You are not authorized"})
}
module.exports.isAuthenticated = async (req, res, next) => {
    if(!req.get("authorization") || !req.get("authorization").startsWith("Bearer "))
        return res.status(401).send({error: "You are not authorized to access this route"})
    const token = req.get("authorization").split(" ")[1]
    const payload = decode(token)
    const user = await User.findById(payload.id)
    if(user){
        req.payload = {id: user._id, isStaff: user.isStaff, isSuperUser: user.isSuperUser}
        return next()
    }
    return res.status(401).send({error: "You are not authorized"})
}
