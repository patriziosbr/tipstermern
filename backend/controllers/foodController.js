const asyncHandler = require('express-async-handler')
const Food = require("../model/foodModel")
const User = require("../model/userModel")


//@desc get goals
//@route GET /api/event
//@access Private
const getFoods= asyncHandler(async (req, res) => {
    const food = await Food.find({user: req.user.id})
    res.status(200).json(food)
})

//@desc set event
//@route POST /api/event
//@access Private
const setFood = asyncHandler(async (req, res) => {
    if(!req.body.foodName) {
        res.status(400)
        throw new Error("add foodName in body") //restituisce l'errore in html per ricevere un json fare middleware 
    }
    if(!req.body.foodWeight) {
        res.status(400)
        throw new Error("add foodWeight in body") 
    }
    if(!req.body.courseType) {
        res.status(400)
        throw new Error("add courseType in body") 
    }
    const food = await Food.create({ 
        foodName: req.body.foodName,
        foodWeight: req.body.foodWeight,
        courseType: req.body.courseType,
        foodIcon: req.body.foodIcon,
        user: req.user.id
    })
    res.status(200).json(food)
})

//@desc update Goals
//@route PUT/PATCH /api/food/:id
//@access Private
const updateFood = asyncHandler(async (req, res) => {
    const food = await food.findById(req.params.id)
    if(!food) {
        throw new Error("add food in url / food not found ")
    }
    //check user
    if(!req.user) {
        res.status(401)
        throw new Error("user not found")
    }
    //check if user is owner
    if(food.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("user not authorized")
    }
    const updatedFood= await Food.findByIdAndUpdate(req.params.id, req.body, {new : true})
    res.status(200).json(updatedFood)
})

//@desc cancel goals
//@route DELETE /api/food/:id
//@access Private
const deleteFood = asyncHandler(async (req, res) => {
    const food = await Food.findById(req.params.id);
    if(!food) {
        throw new Error("food not found")
    }
    //check user
    if(!req.user) {
        res.status(401)
        throw new Error("user not found")
    }
    //check if user is owner
    if(food.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("user not authorized")
    }
    // await Goal.findByIdAndDelete(req.params.id) //soluzione mia al volo rifaccio la query 
    await food.deleteOne(); //remove() is not a function ??
    res.status(200).json({id:req.params.id}) //porta in FE solo ID dell'elemento eliminato 
})



module.exports = {
    getFoods,
    setFood,
    updateFood,
    deleteFood
}