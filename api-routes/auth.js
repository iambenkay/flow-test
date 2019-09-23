const User = require("../models/User")
const jwt = require("jsonwebtoken")

const router = require("express").Router()


router.post("/login", (req, res) => {
    console.log(req.body)
    const {email, password} = req.body
    if (!(email && 
        password)){
        console.log(email, password)
        const message = "You have to provide an email and password"
        return res.status(400).json({message})
    }
    const user = User.findOne({where: {email}}).then(user => {
        if(!user) return res.status(401).json({ message: 'No such user found', user: user })
        if(user.authPassword === password){
            const payload = {id: user.id, isStaff: user.isStaff, isSuperUser: user.isSuperUser}
            const token = jwt.sign(payload, "myunguessablesecretkey")
            res.json({success: "Login successful", token, user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }})
        } else res.status(401).json({message: "Password is incorrect"})
    })
})


module.exports = router
