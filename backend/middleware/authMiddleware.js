const jwt = require("jsonwebtoken")
const asyncHandler = require('express-async-handler')
const User = require("../model/userModel")

const protect = asyncHandler( async(req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            //Get token from header
            token = req.headers.authorization.split(" ")[1];
            //Verify TOken
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //Get user from the token
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("not auth")
        }
    }

    if(!token) { //if not token at all
        res.status(401);
        throw new Error("no token")
    }
})

module.exports = { protect }