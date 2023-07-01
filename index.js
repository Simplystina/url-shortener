const app = require("./app")
const {connect} = require("./Database/index")

const PORT = process.env.PORT || 3334

connect()

app.listen(PORT, ()=>{
    console.log("Server is listening at ",PORT)
})