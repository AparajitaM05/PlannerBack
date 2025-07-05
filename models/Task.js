const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const subTaskSchema = new mongoose.Schema({
    // id: {type: String, default:uuidv4()},
    title: {type:String, required: true},
    completed: {type: Boolean, required: false}
})
const taskSchema = new mongoose.Schema({
    
    title: {type:String, required: true},
    subTasks: [subTaskSchema],
    completed: {type: Boolean, required: false},
  
})

const MainTask = mongoose.model("mainTask", taskSchema);
module.exports = MainTask;