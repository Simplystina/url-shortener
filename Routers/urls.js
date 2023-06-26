const express = require("express")
const urlsController = require("../Controllers/urls")

require("dotenv").config()

const urlsRouter = express.Router()



urlsRouter.post('/shorten', urlsController.shorten)


module.exports = urlsRouter