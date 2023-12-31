const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next)=>{
    const bearerHeader = req.headers["authorization"]
   

    if (typeof bearerHeader ===  'undefined') {

        return res.status(403).json({success: false, message: "A token is required for authentication"})
    }
    try {
        const bearer = bearerHeader.split(' ')
        const token = bearer[1]
        
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
        req.user = decoded
    } catch (error) {
        console.log(error)
        return res.status(401).json({success: false, message: "Invalid Token"})
    }
    return next()
}

module.exports = verifyToken