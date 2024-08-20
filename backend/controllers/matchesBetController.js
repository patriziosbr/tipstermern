const asyncHandler = require('express-async-handler')
const MatchesBet = require("../model/matchesBetModel")
const User = require("../model/userModel")


//@desc get goals
//@route GET /api/match
//@access Private
const getMatchesBet = asyncHandler(async (req, res) => {
    // const event = await Event.find({user: req.user.id})
    const matchBets = await MatchesBet.find()
    res.status(200).json(matchBets)
})

//@desc set match
//@route POST /api/match
//@access Private
const setMatchesBet = asyncHandler(async (req, res) => {
    // Ensure req.body is an array
    const matches = Array.isArray(req.body) ? req.body : [req.body];

    if (!matches || matches.length < 1) {
        res.status(400);
        throw new Error("add matches is missing");
    }

    // Create a new MatchesBet record
    const matchBets = await MatchesBet.create({
        user: req.user.id,
        matches: matches, // Will be filled after match creation
    });

    res.status(200).json(matchBets);
});

//@desc update Goals
//@route PUT/PATCH /api/event/:id
//@access Private
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
    if(!event) {
        throw new Error("add event in url / event not found ")
    }

    //check user
    if(!req.user) {
        res.status(401)
        throw new Error("user not found")
    }
    //check if user is owner
    if(event.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("user not authorized")
    }
    const updatedEvent= await Event.findByIdAndUpdate(req.params.id, req.body, {new : true})
    res.status(200).json(updatedEvent)
})

//@desc cancel goals
//@route DELETE /api/event/:id
//@access Private
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if(!event) {
        throw new Error("event not found")
    }

    //check user
    if(!req.user) {
        res.status(401)
        throw new Error("user not found")
    }
    //check if user is owner
    if(event.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("user not authorized")
    }
    // await Goal.findByIdAndDelete(req.params.id) //soluzione mia al volo rifaccio la query 
    await event.deleteOne(); //remove() is not a function ??
    res.status(200).json({id:req.params.id}) //porta in FE solo ID dell'elemento eliminato 
})



module.exports = {
    getMatchesBet,
    setMatchesBet,
    // updateEvent,
    // deleteEvent
}