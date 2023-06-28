const express = require("express")
const urlsController = require("../Controllers/urls")

require("dotenv").config()

const urlsRouter = express.Router()



urlsRouter.post('/shorten', urlsController.shorten)
urlsRouter.get('/generateQRCode/:shortId', urlsController.qrCodeGenerate)
urlsRouter.get('/links/history', urlsController.getLinkHistory)

module.exports = urlsRouter