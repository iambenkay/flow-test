const router = require("express").Router()

const u = require("../controllers/UserController");
const authenticator = require("passport").authenticate('jwt', {session: false})

router.route("/")
    .get(u.getUsers)
    .post(u.createUser)

router.route("/:id")
    .get(u.getUser)
    .delete(u.deleteUser)

module.exports = router
