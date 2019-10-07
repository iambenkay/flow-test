const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const User = require('./models/User')
const cursor = require('./db/cursor');
const API_ROUTES = require('./api-routes')

const app = express()
const port = process.env.PORT || 8081

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use("/api", API_ROUTES)

const server = app.listen(port, () => {
    console.log(`Flow test is running at port: ${port}`)
})
