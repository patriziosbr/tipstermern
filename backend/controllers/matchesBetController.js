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

// const getMatchesBet = asyncHandler(async (req, res) => {
//     const matchBets = await MatchesBet.find().populate('matches');
//     console.log(matchBets, "matchBets controller");
    
//     res.status(200).json(matchBets);
// });

const getMatchesBet = asyncHandler(async (req, res) => {
    const matchBets = await MatchesBet.find().populate('matches');

    // Loop through each matchBet
    for (let matchBet of matchBets) {
        // Check if at least one matchWin is 2 (pending)
        const hasPendingMatch = matchBet.matches.some(match => match.matchWin === 2);
        matchBet.profit = 0

        if (hasPendingMatch) {
            // If there's at least one pending match, set isWin to null
            matchBet.isWin = null;
        } else {
            // Otherwise, check if all matches are won
            const allMatchesWin = matchBet.matches.every(match => match.matchWin === 1);
            
            if (allMatchesWin) {
                matchBet.isWin = true; // All matches are won
                matchBet.profit = matchBet.totalWin - matchBet.betPaid
            } else {
                matchBet.isWin = false; // At least one match is lost
                matchBet.profit = -matchBet.betPaid
            }
        }

        // Save the updated matchBet document
        await matchBet.save();
    }
    // console.log(matchBets, "matchBets controller");
    const reversedMatchBets = matchBets.reverse();
    
    res.status(200).json(reversedMatchBets);
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
    
    let TempOdds = parseFloat(req.body.totalOdds);
    let vincita, profitto;
    let parsePaid = parseFloat(req.body.betPaid);
    // console.log(typeof TempOdds, "typeof TempOdds");
    // console.log(TempOdds, "TempOdds");
    
    if (req.body.isWin) {
        vincita = TempOdds.toFixed(2) * parsePaid;
        profitto = vincita - parsePaid;
    } else if (req.body.isWin === null || req.body.isWin === undefined || req.body.isWin === 2) {
        vincita = TempOdds.toFixed(2) * parsePaid;
        profitto = null;
    } else {
        vincita = 0;
        profitto = -parsePaid;
    }
    console.log(req.body.betPaid, "req.body.betPaid controller");
    
    // Create a new MatchesBet record
    const matchBets = await MatchesBet.create({
        user: req.user.id,
        matches: matches, // Will be filled after match creation
        isWin: req.body.isWin,
        betPaid: req.body.betPaid ? req.body.betPaid : 1,
        totalOdds: TempOdds,
        totalWin: vincita,
        profit: profitto
    });

    // console.log(matchBets, "matchBets");
    
    res.status(200).json(matchBets);
});

//@desc update Goals
//@route PUT/PATCH /api/matchesBet/:id
//@access Private
const updateUpdateEvent = asyncHandler(async (req, res) => {
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

//@desc cancel matchBet in cascade match
//@route DELETE /api/event/:id
//@access Private
const deleteMatchesBet = asyncHandler(async (req, res) => {
    // Find the matchBet by ID
    const matchBet = await MatchesBet.findById(req.params.id);
    
    if(!matchBet) {
        throw new Error("MatchesBet not found");
    }

    // Check if the user is authenticated
    if(!req.user) {
        res.status(401);
        throw new Error("User not found");
    }

    // Check if the user is the owner of the matchBet
    if(matchBet.user.toString() !== req.user.id){
        res.status(401);
        throw new Error("User not authorized");
    }

    // Cascade delete: Delete all related matches
    await Match.deleteMany({ _id: { $in: matchBet.matches } }); 

    // Delete the matchBet
    await matchBet.deleteOne();

    // Return the ID of the deleted matchBet
    res.status(200).json({ id: req.params.id });
});

//@desc get goals
//@route GET /api/matchBets/maxwin
//@access Private
const getMaxWin = asyncHandler(async (req, res) => {
        // const event = await Event.find({user: req.user.id})
        const maxWin = await MatchesBet.find()
        res.status(200).json(maxWin)
    })



module.exports = {
    getMatchesBet,
    setMatchesBet,
    // updateEvent,
    deleteMatchesBet,
    getMaxWin
}