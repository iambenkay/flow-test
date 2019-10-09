const mongoose = require("mongoose")
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flow-test'

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})

const cursor = mongoose.connection

cursor.on('error', error => {
    console.error(error)
})
cursor.once('open', () => {
    console.log('Database connection has been established')
})
