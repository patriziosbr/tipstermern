const mongoose = require('mongoose')
const eventSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        emailReciever: {
            type: String,
            require: [true, 'Please add a email value']
        },
        startAt: {
            type: Date, //(example 2023-06-21)
            require: [true, 'Please add a startAt value']
        },
        endAt: {
            type: Date,
            require: [true, 'Please add a text value']
        },
        hourStart: {
            type: String,
            required: [true, 'Please add a hourStart hour'],
        },
        hourEnd: {
            type: String,
            required: [true, 'Please add an hourEnd hour'],
        },
        title: {
            type: String,
            require: [true, 'Please add a title value']
        },
        bodyEvent: {
            type: String,
            require: [true, 'Please add a bodyEvent value']
        },
        emailSent: {
            type: Boolean,
            default: null
        }
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('Event', eventSchema)