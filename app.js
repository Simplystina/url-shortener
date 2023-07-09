const express = require("express")
const cors = require("cors")
const auth = require("./Middleware/auth")
const bodyParser = require("body-parser")
const urlController = require("./controllers/urls")

require("dotenv").config()

//import Routers
const authRouter = require("./Routers/auth")
const urlsRouter = require("./Routers/urls")
const userRouter = require("./Routers/user")
const rateLimiterUsingThirdParty  = require('./Middleware/rateLimit')


const PORT = process.env.PORT 

const app = express()

app.get("/:shortId", urlController.urlRedirect) //endpoint to redirect to original link


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())


app.options('*', cors()); // preflight OPTIONS; put before other routes
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//app.use(rateLimiterUsingThirdParty); //rate limiting
app.use('/auth', authRouter)
app.use('/urls', auth,urlsRouter)
app.use('/user', auth, userRouter)

app.get('/',(req,res)=>{
    res.status(200).send({message:"Home Route",status:true})
})

app.use("*",(req,res)=>{
    return res.status(404).json({message:"route not found"})
})

module.exports = app