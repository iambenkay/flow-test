const router = require("express").Router()

router.use("/auth", require("./auth"))
router.use("/users", require("./users"))
router.use("/tests", require("./tests"))
router.use("/records", require("./records"))
router.use("/questions", require("./questions"))

module.exports = router
