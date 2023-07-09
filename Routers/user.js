const express = require("express")
const userController = require("../controllers/user")

require("dotenv").config()

const userRouter = express.Router()



userRouter.get('/info', userController.getUser)

module.exports = userRouter