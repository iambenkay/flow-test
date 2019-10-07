const router = require("express").Router()
const Test = require('../models/Test')
const {isAuthenticated, isAdmin} = require("../utils/middleware")

router.route("/")
    .get(isAuthenticated, (req, res) => {
        Test.find({}, '-questions', {lean: true})
        .then(tests => {
            if(!req.payload.isSuperUser)
                return res.send(tests.filter(test => test.published))
            else return res.send(tests)
        })
        .catch(() => {
            return res.status(404).send({error: "Something went wrong"})
        })
    })
    .post(isAdmin, (req, res) => {
        const {
            name,
            code,
            noOfQuestions,
            passPercent,
            duration,
        } = req.body
        if(!req.payload)
            return res.status(401).send({ error: "You are not authorized" })
        if (!(name &&
            code &&
            noOfQuestions &&
            duration &&
            passPercent)) {
            const error = "You must provide all 5 properties to " +
                "create a test: ( name, code, duration, noOfQuestions, passPercent)"
            return res.status(400).send({ error })
        }
        const userId = req.payload.id
        Test.create({
            userId,
            name,
            code,
            noOfQuestions,
            duration: +duration,
            passPercent,
        })
        .then(test => {
            return res.status(201).send(test)
        })
        .catch(() => {
            const error = "Cannot create resource"
            return res.status(500).send({ error })
        })
    })

router.route("/:id")
    .get(isAuthenticated, (req, res) => {
        const {id} = req.params

        Test.findById(id, null, {lean: true})
        .then(test => {
            if(test.published || req.payload.isSuperUser)
            return res.send(test)
        })
        .catch(() => {
            return res.status(404).send({error: "Not found"})
        })
    })
    .delete(isAdmin, (req, res) => {
        const {id} = req.params

        Test.findByIdAndDelete(id, null, {lean: true})
        .then(test => {
            return res.send({success: "Deleted"})
        })
        .catch(() => {
            return res.status(404).send({error: "Not Found"})
        })
    })

router.put("/:id/publish", isAdmin, (req, res) => {
    const {id} = req.params

    Test.findById(id)
        .then(test => {
            if(test.questions.length < test.noOfQuestions)
                return res.status(400).send({error: "You can't publish an incomplete test. Create all questions"})
            test.published = true
            test.save()
            const data = test.toJSON()
            delete(data.questions)
            return res.send(data)
        })
        .catch((e) => {
            console.log(e.message)
            return res.status(404).send({error: "Not found"})
        })
})
router.put("/:id/unpublish", isAdmin, (req, res) => {
    const {id} = req.params

    Test.findById(id)
        .then(test => {
            test.published = false
            test.save()
            const data = test.toJSON()
            delete(data.questions)
            return res.send(data)
        })
        .catch((e) => {
            console.log(e.message)
            return res.status(404).send({error: "Not found"})
        })
})

module.exports = router
