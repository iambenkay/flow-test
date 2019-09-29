const express = require('express')
const passport = require('passport')
const passportJWT = require('passport-jwt')

const User = require('./models/User')
const cursor = require("./db/cursor");
const API_ROUTES = require("./api-routes")

const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: "myunguessablesecretkey",
}

const strategy = new JWTStrategy(jwtOptions, function(jwt_payload, next){
    console.log('payload received', jwt_payload)
    let user = (async () => await User.findByPk({id: jwt_payload.id}))()
    if(user) next(null, user)
    else next(null, false)

})

passport.use(strategy)

const app = express()
const port = process.env.PORT || 8081

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use((req, res, next) => {
    res.set("access-control-allow-origin", "*")
    res.set("access-control-allow-headers", "*")
    res.set("access-control-allow-methods", "*")
    next()
})

cursor.sync()

app.use("/api", API_ROUTES)

const server = app.listen(port, () => {
    console.log(`Flow test is running at port: ${port}`)
})

server.on('close', () => {
    cursor.end()
})
