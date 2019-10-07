const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
    questionNo: {type: String, required: true},
    questionBody: {type: String, required: true},
    options: {
        A: {type: String, required: true},
        B: {type: String, required: true},
        C: {type: String, required: true},
        D: {type: String, required: true},
    },
    answer: {type: String, required: true},
})

const TestSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, unique: true, required: true},
    code: {type: String, unique: true, required: true},
    noOfQuestions: {type: Number, required: true},
    passPercent: {type: Number, required: true},
    questions: [QuestionSchema],
    duration: {type: Number, required: true},
    published: {type: Boolean, required: true, default: false}
})

module.exports = mongoose.model('Test', TestSchema)
