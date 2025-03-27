const asyncHandler = require('express-async-handler')
const SchedaSpese = require("../model/schedaSpeseModel")
const User = require("../model/userModel")

//@desc get goals
//@route GET /api/goals
//@access Private
const getSchedaSpese = asyncHandler(async (req, res) => {
    const goals = await SchedaSpese.find({user: req.user.id})
    res.status(200).json(goals)
})

//@desc set goals
//@route POST /api/goals
//@access Private
const setSchedaSpese = asyncHandler(async (req, res) => {
    
    if(!req.body.titolo) {
        // return res.status(400).json({data: "add text in body"}) //soluzione mia con return
        res.status(400)
        throw new Error("add titolo in body") //restituisce l'errore in html per ricevere un json fare middleware 
    }

    const notaSpese = await SchedaSpese.create({ 
        titolo: req.body.titolo,
        inserimentoData: req.body.inserimentoData,
        notaSpese: req.body.notaSpese,
        condivisoCon: req.body.condivisoCon,
        user: req.user.id
    })

    res.status(200).json(notaSpese)
})

// //@desc update Goals
// //@route PUT/PATCH /api/goals/:id
// //@access Private
// const updateGoal = asyncHandler(async (req, res) => {
//     const goal = await Goal.findById(req.params.id)
//     if(!goal) {
//         throw new Error("add text in body")
//     }

//     //check user
//     if(!req.user) {
//         res.status(401)
//         throw new Error("user not found")
//     }
//     //check if user is owner
//     if(goal.user.toString() !== req.user.id){
//         res.status(401)
//         throw new Error("user not authorized")
//     }
//     const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new : true})
//     res.status(200).json(updatedGoal)
// })
// //@desc cancel goals
// //@route DELETE /api/goals/:id
// //@access Private
// const deleteGoal = asyncHandler(async (req, res) => {
//     const goal = await Goal.findById(req.params.id);
//     if(!goal) {
//         throw new Error("goal not found")
//     }

//     //check user
//     if(!req.user) {
//         res.status(401)
//         throw new Error("user not found")
//     }
//     //check if user is owner
//     if(goal.user.toString() !== req.user.id){
//         res.status(401)
//         throw new Error("user not authorized")
//     }
//     // await Goal.findByIdAndDelete(req.params.id) //soluzione mia al volo rifaccio la query 
//     await goal.deleteOne(); //remove() is not a function ??
//     res.status(200).json({id:req.params.id}) //porta in FE solo ID dell'elemento eliminato 
// })

module.exports = {
    getSchedaSpese,
    setSchedaSpese,
    // updateGoal,
    // deleteGoal
}