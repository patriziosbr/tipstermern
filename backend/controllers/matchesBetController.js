const asyncHandler = require('express-async-handler')
const MatchesBet = require("../model/matchesBetModel")
const User = require("../model/userModel")


//@desc get goals
//@route GET /api/match
//@access Private
// const getMatchesBet = asyncHandler(async (req, res) => {
//     // const event = await Event.find({user: req.user.id})
//     const matchBets = await MatchesBet.find()
//     res.status(200).json(matchBets)
// })
const Match = require("../model/matchModel")

//@desc Get match bets with calculated profit and loss
//@route GET /api/match
//@access Private
const getMatchesBet = asyncHandler(async (req, res) => {
    const matchBets = await MatchesBet.find();

    const betPaid = 2; // Assuming betPaid is a fixed value, else fetch it dynamically

    const matchIds = matchBets.flatMap(matchBet => matchBet.matches);
    const matches = await Match.find({ _id: { $in: matchIds } });

    const processedBets = matchBets.map(matchBet => {
        const relatedMatches = matches.filter(match => matchBet.matches.includes(match._id.toString()));

        const totalOdds = relatedMatches.reduce((betAcc, match) => {
            const matchOdds = parseFloat(match.odds.replace(',', '.')) || 1;
            return betAcc * matchOdds;
        }, 1);

        let vincita, profitto;

        if (matchBet.isWin) {
            vincita = totalOdds * betPaid;
            profitto = vincita - betPaid;
        } else if (matchBet.isWin === null) {
            vincita = 1 * betPaid;
            profitto = 0;
        } else {
            vincita = 0;
            profitto = -betPaid;
        }


        return {
            ...matchBet.toObject(),
            totalOdds: totalOdds.toFixed(2),
            vincita: vincita.toFixed(2),
            profitto: profitto.toFixed(2),
            relatedMatches
        };
    });

    res.status(200).json(processedBets);
});

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