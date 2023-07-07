const express = require("express")
const urlsController = require("../controllers/urls")

require("dotenv").config()

const urlsRouter = express.Router()



urlsRouter.post('/shorten', urlsController.shorten)

urlsRouter.get('/links/history', urlsController.getLinkHistory)
urlsRouter.delete('/links/:id', urlsController.deleteLink)
urlsRouter.get('/links/:id', urlsController.getLink)

module.exports = urlsRouter