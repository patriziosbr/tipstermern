const asyncHandler = require('express-async-handler')
const MatchesBet = require("../model/matchesBetModel")
const User = require("../model/userModel")
const Match = require("../model/matchModel")

// VERSIONE 1 PER RICORDO //porta giu le schedine con i relativi ID dei match 
//@desc get goals
//@route GET /api/match
//@access Private
// const getMatchesBet = asyncHandler(async (req, res) => {
    //     // const event = await Event.find({user: req.user.id})
    //     const matchBets = await MatchesBet.find()
    //     res.status(200).json(matchBets)
    // })
    
// VERSIONE 1 PER RICORDO //porta giu le schedine con i dati dei match 
const getMatchesBet = asyncHandler(async (req, res) => {
    const matchBets = await MatchesBet.find().populate('matches');
    res.status(200).json(matchBets);
});

//@desc set match
//@route POST /api/match
//@access Private
const setMatchesBet = asyncHandler(async (req, res) => {
    // Ensure req.body is an array
    const matches = Array.isArray(req.body.matches) ? req.body.matches : [req.body.matches];

    if (!matches || matches.length < 1) {
        res.status(400);
        throw new Error("add matches is missing");
    }
    
    let TempOdds = parseFloat(req.body.totalOdds).toFixed(2);
    let vincita, profitto;
    let parsePaid = parseFloat(req.body.betPaid);

    if (req.body.isWin) {
        vincita = TempOdds * parsePaid;
        profitto = vincita - parsePaid;
    } else if (req.body.isWin === null) {
        vincita = 1 * req.body.betPaid;
        profitto = null;
    } else {
        vincita = 0;
        profitto = -req.body.betPaid;
    }
    
    // Create a new MatchesBet record
    const matchBets = await MatchesBet.create({
        user: req.user.id,
        matches: matches, // Will be filled after match creation
        isWin: req.body.isWin,
        betPaid: req.body.betPaid,
        totalOdds: TempOdds,
        totalWin: vincita,
        profit: profitto
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