const express = require('express')
const bootcampControllers = require("../controllers/bootcampControllers")

const router = express.Router()

router.route('/').get(bootcampControllers.getAllBootcamps).post(bootcampControllers.createNewBootcamp)

router.route("/:id").put(bootcampControllers.updateBootcampById).delete(bootcampControllers.deleteBootcampById)

module.exports = router