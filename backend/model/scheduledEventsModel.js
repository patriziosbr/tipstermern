const mongoose = require('mongoose')
const scheduledEventSchema = mongoose.Schema({
    day_game: {
        type: String, 
    },
    tournament_slug: {
        type: String, 
    },
    tournament_id: {
        type: String,  
    },
    name_season: {
        type: String,
    },
    season_year: {
        type: String,
    },
    season_id: {
        type: Number,
    },
    status_code: {
        type: Number,
    },
    status_description: {
        type: String,
    },
    status_type: {
        type: String,
    },
    homeTeam_slug: {
        type: String,
    },
    homeTeam_id: {
        type: Number,
    },
    awayTeam_slug: {
        type: String,
    },
    awayTeam_id: {
        type: Number,
    },
    homeScore_current: {
        type: Number,
    },
    homeScore_period1: {
        type: Number,
    },
    homeScore_period2: {
        type: Number,
    },
    homeScore_period3: {
        type: Number,
    },
    homeScore_period4: {
        type: Number,
    },
    awayScore_current: {
        type: Number,
    },
    awayScore_period1: {
        type: Number,
    },
    awayScore_period2: {
        type: Number,
    },
    awayScore_period3: {
        type: Number,
    },
    awayScore_period4: {
        type: Number,
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('ScheduledEventSchema', scheduledEventSchema)