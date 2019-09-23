const router = require("express").Router()

const t = require("../controllers/AssessmentController");

router.route("/")
    .get(t.getAssessments)
    .post(t.createAssessment)

router.route("/:id")
    .get(t.getAssessment)
    .delete(t.deleteAssessment)

module.exports = router
