const router = require("express").Router()
const User = require('../models/User')
const Test = require('../models/Test')
const {isAuthenticated, isAdmin} = require("../utils/middleware")

router.route('/')
    .post(isAdmin, (req, res) => {
        const {testId,
            questionNo,
            questionBody,
            options,
            answer} = req.body
        if(!testId ||
            !questionNo ||
            !questionBody ||
            !options ||
            !options.A ||
            !options.B ||
            !options.C ||
            !options.D ||
            !answer) return res.status(400).send({error: "You must provide all parameters " +
                "(testId, questionNo, questionBody, options{A-D}, answer)"})
        Test.findById(testId)
            .then(test => {
                if(questionNo < 1 || questionNo > test.noOfQuestions)
                    return res.status(400).send({error: "Invalid question number"})
                if(test.questions.find((test) => test.questionNo == questionNo))
                    return res.status(400).send({error: "Question already exists"})
                test.questions.push({questionNo, questionBody, options, answer})
                test.save()
                return res.status(201).send(test.questions)
            })
            .catch((e) => {
                console.log(e.message)
                return res.status(404).send({error: "Not found"})
            })
    })
    .put(isAdmin, (req, res) => {
        const {testId,
            questionNo,
            questionBody,
            options,
            answer} = req.body
        if(!testId ||
            !questionNo ||
            !questionBody ||
            !options ||
            !options.A ||
            !options.B ||
            !options.C ||
            !options.D ||
            !answer || !["A", "B", "C", "D"].includes(answer)) return res.status(400).send({error: "You must provide all parameters " +
                "(testId, questionNo, questionBody, options{A-D}, answer)"})
        Test.findById(testId)
            .then(test => {
                const que = test.questions.find((test) => test.questionNo == questionNo)
                if(!que)
                    return res.status(400).send({error: "You have not created this question yet"})
                const i = test.questions.indexOf(que)
                delete(test.questions[i])
                test.questions.push({questionNo, questionBody, options, answer})
                test.save()
                return res.status(201).send(test.questions)
            })
            .catch((e) => {
                console.log(e.message)
                return res.status(404).send({error: "Not found"})
            })
    })

module.exports = router
