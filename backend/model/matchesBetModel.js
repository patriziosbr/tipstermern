const mongoose = require('mongoose');

const matchesBetSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    isWin: { 
        type: Boolean, 
        default: null 
    }, // Null initially, then TRUE/FALSE after the bet is resolved
    matches: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Match' 
        }], // Array of Match IDs
    }, 
    {
        timestamps: true 
    }
);

module.exports = mongoose.model('MatchesBet', matchesBetSchema);