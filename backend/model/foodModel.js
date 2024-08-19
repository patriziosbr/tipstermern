const mongoose = require('mongoose')
const foodSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        foodName: {
            type: String,
            require: [true, 'Please add a food name']
        },
        foodWeight: {
            type: Number, //(150gr)
            require: [true, 'Please add a food weight']
        },
        courseType: {
            type: String, //(pasto1, pasto2)
            require: [true, 'Please add a food course type value']
        },
        foodIcon: {
            type: String,
            require: false
        }
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('Food', foodSchema)