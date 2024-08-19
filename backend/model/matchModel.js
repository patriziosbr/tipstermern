const mongoose = require('mongoose')
const matchSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        dateMatch: {
            type: String,
            require: [true, 'Please add a email value']
        },
        homeTeam: {
            type: String, //(example 2023-06-21)
            require: [true, 'Please add a homeTeam value']
        },
        awayTeam: {
            type: String,
            require: [true, 'Please add a awayTeam value']
        },
        league: {
            type: String,
        },
        odds: {
            type: String,
            required: [true, 'Please add an odds hour'],
        },
        typeOfBet: {
            type: String,
            require: [true, 'Please add a typeOfBet value']
        },
        typeOfBet_choice: {
            type: String,
            require: [true, 'Please add a typeOfBet_choice value']
        },
        recognizedText: {
            type: String,
            require: false
        },
        tipster: {
            type: Object,
            required: false,
            default: null
        },
        matchWin: {
            type: Boolean,
            required: false,
            default: null
        }
        // matchesBet: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: false,
        //     ref: 'Match'
        // }, NON MI RICORDO CHE SENSO HA
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('Match', matchSchema)