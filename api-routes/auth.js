const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const {isAuthenticated, isAdmin} = require("../utils/middleware")

const router = require("express").Router()

const secret_key = process.env.SECRET_KEY_JWT || "devsecretkey"

router.post("/login", async (req, res) => {
    const {email, password} = req.body
    if (!(email &&
        password)){
        const error = "You have to provide an email and password"
        return res.status(400).json({error})
    }
    const user = await User.findOne({email}, null, {lean:true})
    if(!user) return res.status(401).json({ error: 'No such user found', user: user })
    const isLegit = await bcrypt.compare(password, user.authPassword)
    if(isLegit){
        const payload = {id: user._id, isStaff: user.isStaff, isSuperUser: user.isSuperUser}
        const token = jwt.sign(payload, secret_key)
        res.json({success: "Login successful", token, user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }})
    } else res.status(401).json({error: "Password is incorrect"})
})
router.get("/roles", isAuthenticated, async (req, res) => {
    return res.send(req.payload)
})

module.exports = router
