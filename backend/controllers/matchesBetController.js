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
// console.log(matchBets, "matchBets controller");

    // Loop through each matchBet
    for (let matchBet of matchBets) {
        // Check if at least one matchWin is 2 (pending)
        const hasPendingMatch = matchBet.matches.some(match => match.matchWin === 2);
        matchBet.profit = 0
        matchBet.totalWin = 0
        if (hasPendingMatch) {
            // If there's at least one pending match, set isWin to null
            matchBet.isWin = null;
        } else {
            // Otherwise, check if all matches are won
            const allMatchesWin = matchBet.matches.every(match => match.matchWin === 1);
            
            if (allMatchesWin) {
                matchBet.isWin = true; // All matches are won
                matchBet.totalWin = matchBet.betPaid*matchBet.totalOdds
                matchBet.profit = matchBet.totalWin - matchBet.betPaid
            } else {
                matchBet.isWin = false; // At least one match is lost
                matchBet.profit = -matchBet.betPaid
                matchBet.totalWin = 0

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
    // Ensure req.body.matches is an array.
    const matches = Array.isArray(req.body.matches) ? req.body.matches : [req.body.matches];
  
    if (!matches || matches.length < 1) {
      res.status(400);
      throw new Error("add matches is missing");
    }
  
    // Calculate bet details using the helper.
    const { totalOdds, totalWin, profit } = calculateBetDetails({
      totalOdds: req.body.totalOdds,
      betPaid: req.body.betPaid,
      isWin: req.body.isWin
    });
  
    // Create a new MatchesBet record.
    const matchBets = await MatchesBet.create({
      user: req.user.id,
      matches: matches,
      isWin: req.body.isWin,
      betPaid: req.body.betPaid ? req.body.betPaid : 1,
      totalOdds,
      totalWin,
      profit
    });
  
    res.status(200).json(matchBets);
  });

//@desc update Goals
//@route PUT/PATCH /api/matchesBet/:id
//@access Private
const updateMatchBet = asyncHandler(async (req, res) => {
  const event = await MatchesBet.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // Check user authentication and ownership.
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }
  if (event.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Merge current event data with the incoming update data.
  const updatedData = { ...event.toObject(), ...req.body };


  // If one of these fields is updated, recalculate bet details.
  if (req.body.totalOdds || req.body.betPaid || req.body.isWin !== undefined) {
    const betDetails = calculateBetDetails({
      totalOdds: updatedData.totalOdds,
      betPaid: updatedData.betPaid,
      isWin: updatedData.isWin
    });
    updatedData.totalOdds = betDetails.totalOdds;
    updatedData.totalWin = betDetails.totalWin;
    updatedData.profit = betDetails.profit;
  }

  console.log("run");


  const updatedEvent = await MatchesBet.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  res.status(200).json(updatedEvent);
});

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


 // HELPER FUNCTIONS   
 const calculateBetDetails = ({ totalOdds, betPaid, isWin }) => {
    const parsedOdds = parseFloat(totalOdds);
    const parsedPaid = parseFloat(betPaid);
    // Fix the odds to 2 decimal places.
    const computedOdds = parseFloat(parsedOdds.toFixed(2));
    let totalWin, profit;
  
    if (isWin === 1) { // Win condition
      totalWin = computedOdds * parsedPaid;
      profit = totalWin - parsedPaid;
    } else if (isWin === 2 || isWin === null || isWin === undefined) { 
      // Pending or undefined result
      totalWin = computedOdds * parsedPaid;
      profit = null;
    } else { // Loss condition (assumes isWin is 0 or any falsy value other than 2)
      totalWin = 0;
      profit = -parsedPaid;
    }
  
    return { totalOdds: parsedOdds, totalWin, profit };
  };


module.exports = {
    getMatchesBet,
    setMatchesBet,
    updateMatchBet,
    deleteMatchesBet,
    getMaxWin
}