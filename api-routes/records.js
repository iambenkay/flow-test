const router = require("express").Router()
const Record = require('../models/Record')
const Assessment = require('../models/Assessment')
const jwt = require("jsonwebtoken")

router.route("/:testId/records/")
    .post((req, res) => {
        Assessment.findByPk(req.params.testId)
            .then(assessment => {
                Record.findOne({
                    where: {
                        AssessmentId: req.params.testId,
                        UserId: jwt.decode(req.get("Authorization").split(" ")[1]).id,
                        submitted: false,
                    },
                }).then(record => {
                    if (record) {
                        const { solutions, expires, submitted, started } = record
                        return res.json({ solutions, expires, submitted, started })
                    }
                    Record.create({
                        AssessmentId: req.params.testId,
                        expires: Date.now() + (assessment.duration * 60 * 1000),
                        UserId: jwt.decode(req.get("Authorization").split(" ")[1]).id,
                    }).then(record => {
                        const { solutions, expires, submitted, started } = record
                        return res.json({ solutions, expires, submitted, started })
                    })
                })
            })
    })
    .put((req, res) => {
        const { solutions } = req.body
        Record.findOne({
            where: {
                AssessmentId: req.params.testId,
                UserId: jwt.decode(req.get("Authorization").split(" ")[1]).id,
                submitted: false,
            },
        }).then(record => {
            record.update({ solutions: solutions })
            record.save()
            const { expires, submitted, started } = record
            return res.json({ solutions, expires, submitted, started })
        })
    })

router.get("/:testId/records/submitted", (req, res) => {
    Record.findAll({
        where: {
            AssessmentId: req.params.testId,
            UserId: jwt.decode(req.get("Authorization").split(" ")[1]).id,
            submitted: true,
        },
    }).then(records => {
        if (records) {
            records.sort((a, b) => new Date(a.updatedAt) < new Date(b.updatedAt))
            res.send(records)
        }
        else throw new Error("Something went wrong")
    })
    .catch(error => {
        res.send({message: "Something went wrong"})
    })
})

router.route("/:testId/records/submit")
    .post((req, res) => {
        Record.findOne({
            where: {
                AssessmentId: req.params.testId,
                UserId: jwt.decode(req.get("Authorization").split(" ")[1]).id,
                submitted: false,
            },
        }).then(record => {
            if (record) {
                Assessment.findByPk(req.params.testId)
                    .then(assessment => {
                        if (assessment){
                            score = 0
                            const answers = assessment.questions.map(q => [q.questionNo, q.answer])
                            s = Object.entries(record.solutions)
                            for (let [n, a] of s){
                                if (a === answers.find(x => x[0] == n)[1]) score ++
                            }
                            score = (score / assessment.noOfQuestions) * 100
                            passed = (score >= assessment.passPercent) ? true : false
                            record.update({ submitted: true, score, passed })
                            record.save()
                            res.send({success: "You have successfully submitted"})
                        }
                    })
            }
            else throw new Error("Something went wrong")
        })
        .catch(error => {
            res.send({message: "Something went wrong"})
        })
    })

module.exports = router
