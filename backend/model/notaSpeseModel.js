const mongoose = require('mongoose')
const notaSpeseSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        testo: {
            type: String,
            require: [true, 'Please add a testo value']
        },
        inserimentoData: {
            type: Date,
            default: Date.now 
        },
        importo: {
            type: Number,
            require: [true, 'Please add a importo value']
        },
        categoria_id: {
            type: Array,
            ref: 'Categoria'
        },
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('NotaSpese', notaSpeseSchema)