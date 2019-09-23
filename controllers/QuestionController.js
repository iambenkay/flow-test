const Assessment = require('../models/Assessment')

const getQuestion = (req, res) => {
    const { id, q_no } = req.params

    Assessment.findByPk(id)
        .then(test => {
            const result = test.questions.find(question => question.questionNo === +q_no)
            const {questionBody, questionNo, options} = result
            if (!result) throw new Error("It has been")
            res.send({questionBody, questionNo, options})
        })
        .catch(() => {
            const message = "Not Found"
            res.status(404).send({ message })
        })
}

const deleteQuestion = (req, res) => {
    const { id, q_no } = req.params

    Assessment.findByPk(id)
        .then(test => {
            if(!test.questions.find(question => question.questionNo === +q_no)) res.status(404).send({ message: `There is no question number ${q_no}` })
            const result = test.questions.filter(question => question.questionNo !== +q_no)
            test.update({questions: [...result]})
            test.save()
            const success = `Question with no: ${q_no} was deleted`
            res.status(200).send({ success })
        })
        .catch(e => {
            const message = "Not Found"
            res.status(404).send({ message })
        })
}

const createQuestion = (req, res) => {
    const {
        questionNo,
        questionBody,
        options,
        answer,
    } = req.body;
    if (!(questionNo &&
        questionBody &&
        options.A &&
        options.B &&
        options.C &&
        options.D &&
        answer)) {
        const message = "You must provide all 4 properties to " +
            "create a question: (questionNo, questionBody, options[A-D], answer)"
        return res.status(400).send({ message })
    }

    Assessment.findByPk(req.params.id)
        .then(test => {
            const a = test.questions.find(x => x.questionNo === questionNo)
            const {A,B,C,D} = options
            if(!a &&
                test.questions.length < test.noOfQuestions){
                test.questions.push({
                    questionNo,
                    questionBody,
                    options: {A,B,C,D},
                    answer
                })
                list =  [...test.questions]
                test.update({questions: list})
                test.save()
                return res.status(201).send({success: `Question ${questionNo} was created`, questionNo, questionBody, options})
            }
            else throw new Error("It has been")
        }).catch(e => {
            const message = "Couldn't create resource"
            res.status(500).send({ message })
        })
}

const getQuestions = (req, res) => {
    
    Assessment.findByPk(req.params.id)
        .then(test => {
            console.log(test.questions)
            const result = test.questions.map(question => {
                const {
                    questionNo,
                    questionBody,
                    options,
                } = question;
                return {
                    questionNo,
                    questionBody,
                    options,
                }
            })
            return res.send(result)
        })
        .catch(e => {
            const message = "Something went Wrong"
            res.status(500).send({ message })
        })
}

module.exports = { getQuestion, getQuestions, createQuestion, deleteQuestion }
