const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require('express-async-handler')
const User = require("../model/userModel")


//@desc Register new User
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        res.status(400)
        throw new Error("add name || email || password in body") //restituisce l'errore in html per ricevere un json vedere ./middleware 
    }
    //check if user exist 
    const userExists = await User.findOne({ email });
    if(userExists) {
        res.status(400)
        throw new Error("user exist") //restituisce l'errore in html per ricevere un json vedere ./middleware 
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({ name, email, password: hashedPass })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("invalid user data")
    }
})


//@desc Authenticate a User
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    //check user
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("invalid credential")
    }
})

//@desc Get User data
//@route GET /api/users/me
//@access Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})


//generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


module.exports = {
    registerUser,
    loginUser,
    getMe
}


// ESEMPI BASE PER TESTARE LE ROTTE IN POSTMAN
// //@desc Authenticate a User
// //@route POST /api/users/login
// //@access Public
// const loginUser = (req, res) => {
//     res.json({message: "logged in user"})
// }
// //@desc Get User data
// //@route GET /api/users/me
// //@access Public
// const getMe = (req, res) => {
//     res.json({message: "user data"})
// }