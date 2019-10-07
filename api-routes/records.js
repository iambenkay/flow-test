const router = require("express").Router()
const User = require('../models/User')
const Test = require('../models/Test')
const {isAuthenticated, isAdmin} = require("../utils/middleware")

router.route("/")
    .get(isAuthenticated, async (req, res) => {
        const {id} = req.payload

        const user = await User.findById(id)
        if (user && user.record.submitted){
            return res.send(user.record)
        }
        else return res.send({info: "You need to complete a current test to access this page"})
    })
    .post(isAuthenticated, async (req, res) => {
        const {id} = req.payload
        const {testId} = req.body
        if(!testId) return res.status(400).send({error: "You must provide testId"})
        try {
            const test = await Test.findById(testId)
            if(!test.published) return res.status(400).send({error: "You must provide a published test"})
            const expires = Date.now() + (test.duration * 60 * 1000)
            const user = await User.findById(id)
            user.record = {submitted: false, score: null, passed: false, testId, expires}
            user.save()
            return res.status(201).send(user.record)
        } catch(e){
            return res.status(400).send({error: "You messed up"})
        }
    })
    .put(isAuthenticated, async (req, res) => {
        const {solutions, testId} = req.body
        const {id} = req.payload

        if(!testId || !solutions) return res.status(400).send({error: "You must provide testId and solutions"})
        try {
            const test = await Test.findById(testId)
            const user = await User.findById(id)
            if(!user.record || (user.record.testId != testId) || user.record.submitted)
                return res.status(404).send({error: "???"})
            const answers = test.questions.map(x => [x.questionNo, x.answer])
            const my_answers = Object.entries(solutions)
            let score = 0
            my_answers.forEach(([n, a]) => {
                if(a === answers.find(([q_n, q_a]) => q_n === n)[1]) score ++
            })
            score = (score / test.noOfQuestions) * 100
            passed = (score >= test.passPercent) ? true : false
            user.record.submitted = true
            user.record.score = score
            user.record.passed = passed
            user.save()
            return res.status(200).send(user.record)
        } catch(e){
            return res.status(400).send({error: "You messed up"})
        }
    })

module.exports = router
