const mongoose = require('mongoose')
const schedaSpeseSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        titolo: {
            type: String,
            require: [true, 'Please add a testo value']
        },
        inserimentoData: {
            type: Date,
            default: Date.now 
        },
        notaSpese: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'NotaSpese'
            }
        ],
        condivisoCon: {
            type: Array,
        },
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('SchedaSpese', schedaSpeseSchema)