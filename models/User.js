const mongoose = require('mongoose')

const newUserSchema = new mongoose.Schema({
    id:{type: String, required:true},
    password:{type:String, required: true}
})

const User = mongoose.model("newUser", newUserSchema)
module.exports= User