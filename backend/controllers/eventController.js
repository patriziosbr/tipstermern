const asyncHandler = require('express-async-handler')
const Event = require("../model/eventModel")
const User = require("../model/userModel")


//@desc get goals
//@route GET /api/event
//@access Private
const getEvents= asyncHandler(async (req, res) => {
    // const event = await Event.find({user: req.user.id})
    const event = await Event.find()
    console.log();
    res.status(200).json(event)
})

//@desc set event
//@route POST /api/event
//@access Private
const setEvent = asyncHandler(async (req, res) => {
    if(!req.body.emailReciever) {
        res.status(400)
        throw new Error("add email in body") //restituisce l'errore in html per ricevere un json fare middleware 
    }
    if(!req.body.startAt || !req.body.endAt) {
        res.status(400)
        throw new Error("add startAt/endAt in body") 
    }
    if(!req.body.hourStart || !req.body.hourEnd) {
        res.status(400)
        throw new Error("add startHourAt/endHourAt in body") 
    }
    if(!req.body.title || !req.body.title) {
        res.status(400)
        throw new Error("add text in body") 
    }
    const event = await Event.create({ 
        emailReciever: req.body.emailReciever,
        startAt: req.body.startAt,
        endAt: req.body.endAt,
        hourStart: req.body.hourStart,
        hourEnd: req.body.hourEnd,
        title: req.body.title,
        bodyEvent: req.body.bodyEvent,
        user: req.user.id
    })
    res.status(200).json(event)
})

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
    getEvents,
    setEvent,
    updateEvent,
    deleteEvent
}