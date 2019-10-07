const mongoose = require("mongoose")

mongoose.connect('mongodb://127.0.0.1:27017/flow-test', {useNewUrlParser: true, useUnifiedTopology: true})

const cursor = mongoose.connection

cursor.on('error', error => {
    console.error(error)
})
cursor.once('open', () => {
    console.log('Database connection has been established')
})
