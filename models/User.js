const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RecordSchema = new Schema({
    testId: {type: Schema.Types.ObjectId, ref: 'Test', required: true},
    expires: {type: Date, required: true},
    submitted: {type: Boolean, required: true, default: false},
    score: Number,
    passed: Boolean,
})

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {type: String, lowercase: true, unique: true},
    authPassword: String,
    record: RecordSchema,
    isStaff: {type: Boolean, required: true, default: false},
    isSuperUser: {type: Boolean, required: true, default: false},
})

module.exports = mongoose.model('User', UserSchema)
