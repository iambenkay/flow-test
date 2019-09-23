const router = require("express").Router()

const q = require("../controllers/QuestionController");

router.route("/:id")
    .get(q.getQuestions)
    .post(q.createQuestion)

router.route("/:id/:q_no")
    .get(q.getQuestion)
    .delete(q.deleteQuestion)

module.exports = router
