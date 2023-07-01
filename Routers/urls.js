const express = require("express")
const urlsController = require("../controllers/urls")

require("dotenv").config()

const urlsRouter = express.Router()



urlsRouter.post('/shorten', urlsController.shorten)
urlsRouter.get('/generate-qrcode/:shortId', urlsController.generateqrcode)
urlsRouter.get('/links/history', urlsController.getLinkHistory)
urlsRouter.delete('/links/:id', urlsController.deleteLink)

module.exports = urlsRouter