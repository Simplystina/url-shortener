const express = require("express")
const authController = require("../controllers/auth")

require("dotenv").config()

const authRouter = express.Router()



authRouter.post('/signup', authController.register)
authRouter.post('/login', authController.login)
authRouter.get('/verify', authController.verify)
authRouter.post('/resend-link',authController.resendVerification)

module.exports = authRouter