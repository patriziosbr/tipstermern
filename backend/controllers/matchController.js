const asyncHandler = require('express-async-handler')
const Match = require("../model/matchModel")
// const MatchesBet = require("../model/matchesBetModel")
const User = require("../model/userModel")


//@desc get goals
//@route GET /api/match
//@access Private
const getMatch = asyncHandler(async (req, res) => {
    // const event = await Event.find({user: req.user.id})
    const matches = await Match.find()
    res.status(200).json(matches)
})

//@desc set match
//@route POST /api/match
//@access Private
const setMatch = asyncHandler(async (req, res) => {
    // Ensure req.body is an array
    const matches = Array.isArray(req.body) ? req.body : [req.body];
    
    // Validate each match in the array
    for (const match of matches) {
        if (!match.matchDate) {
            res.status(400);
            throw new Error("add matchDate in body");
        }
        if (!match.homeTeam || !match.awayTeam) {
            res.status(400);
            throw new Error("add homeTeam/awayTeam in body");
        }
        if (!match.odds) {
            res.status(400);
            throw new Error("add odds in body");
        }
        if (!match.typeOfBet || !match.typeOfBet_choice) {
            res.status(400);
            throw new Error("add typeOfBet and typeOfBet_choice in body");
        }
    }

    // Create match records in the database
    const createdMatches = await Match.insertMany(
        matches.map(match => ({
            dateMatch: match.matchDate,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            league: match.league,
            odds: match.odds,
            typeOfBet: match.typeOfBet,
            typeOfBet_choice: match.typeOfBet_choice,
            user: req.user.id,
            tipster: match.tipster,
            matchWin: match.matchWin,
            recognizedText: match.recognizedText 
        }))
    );

    res.status(200).json(createdMatches);
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
    getMatch,
    setMatch,
    // updateEvent,
    // deleteEvent
}