const asyncHandler = require('express-async-handler')
const ScheduledEvents = require("../model/scheduledEventsModel")
const User = require("../model/userModel")



//@desc set event
//@route POST /api/event
//@access Private
const setScheduledEvents = asyncHandler(async (req, res) => {
    
    console.log("hello");
    // if(!req.body.emailReciever) {
    //     res.status(400)
    //     throw new Error("add email in body") //restituisce l'errore in html per ricevere un json fare middleware 
    // }
    // if(!req.body.startAt || !req.body.endAt) {
    //     res.status(400)
    //     throw new Error("add startAt/endAt in body") 
    // }
    // if(!req.body.hourStart || !req.body.hourEnd) {
    //     res.status(400)
    //     throw new Error("add startHourAt/endHourAt in body") 
    // }
    // if(!req.body.title || !req.body.title) {
    //     res.status(400)
    //     throw new Error("add text in body") 
    // }
    const event = await ScheduledEvents.create({ 

        day_game:req.body.day_game,
        tournament_slug: req.body.tournament_slug,
        tournament_id: req.body.tournament_id,
        name_season: req.body.name_season,
        season_year: req.body.season_year,
        season_id: req.body.season_id,
        status_code: req.body.status_code,
        status_description: req.body.status_description,
        status_type: req.body.status_type,
        homeTeam_slug: req.body.homeTeam_slug,
        homeTeam_id: req.body.homeTeam_id,
        awayTeam_slug: req.body.awayTeam_slug,
        awayTeam_id: req.body.awayTeam_id,
        homeScore_current: req.body.homeScore_current,
        homeScore_period1: req.body.homeScore_period1,
        homeScore_period2: req.body.homeScore_period2,
        homeScore_period3: req.body.homeScore_period3,
        homeScore_period4: req.body.homeScore_period4,
        awayScore_current: req.body.awayScore_current,
        awayScore_period1: req.body.awayScore_period1,
        awayScore_period2: req.body.awayScore_period2,
        awayScore_period3: req.body.awayScore_period3,
        awayScore_period4: req.body.awayScore_period4,
    })
    res.status(200).json(event)
})




module.exports = {
    setScheduledEvents
}