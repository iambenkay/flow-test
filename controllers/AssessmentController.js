const Assessment = require('../models/Assessment')
const cb = require("./base")
const jwt = require("jsonwebtoken")

const getAssessment = (req, res) => {
    const { id } = req.params

    Assessment.findByPk(id)
        .then(assessment => cb.getCallback(assessment, res))
        .catch(() => cb.errorCallback(res))
}

const deleteAssessment = (req, res) => {
    const { id } = req.params

    Assessment.destroy({
        where: {id},
    })
    .then(assessment => cb.deleteCallback(assessment, "Assessment", res))
    .catch(() => cb.errorCallback(res))
}

const createAssessment = (req, res) => {
    const {
        name,
        code,
        noOfQuestions,
        passPercent,
        duration,
    } = req.body
    if(!(name &&
        code &&
        noOfQuestions &&
        duration &&
        passPercent))
    {
        const message = "You must provide all 5 properties to " +
        "create an assessment: ( name, code, duration, noOfQuestion, passPercent)"
        return res.status(400).send({message})
    }
    const token = req.get("authorization").split(" ")[1]
    const UserId = jwt.decode(token).id
    Assessment.create({
        UserId,
        name,
        code,
        noOfQuestions,
        duration: +duration,
        passPercent,
    })
    .then(assessment => cb.postCallback(assessment, res))
    .catch(() => cb.postErrorCallback(res))
}

const getAssessments = (req, res) => {
    Assessment.findAll({})
    .then(assessments => cb.listCallback(assessments, res))
    .catch(() => cb.listErrorCallback(res))
}

module.exports = {getAssessment, getAssessments, createAssessment, deleteAssessment}
