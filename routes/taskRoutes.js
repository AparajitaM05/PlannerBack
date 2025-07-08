const express = require("express");
const MainTask = require("../models/Task");
const router = express.Router();

// Adding subtasks to main tasks
router.post("/:id/subtasks", async(req,res)=>{
    const id = req.params.id
    
    const {title, completed} = req.body
    try{
        const mainTask = await MainTask.findById(id);
        if(!mainTask) return res.status(404).json({message:"Not Found"})
        const newSubTask = {title, completed}
        mainTask.subTasks.push(newSubTask);

        await mainTask.save();
        res.status(201).json(newSubTask)

    }
    catch(error){
        res.status(500).json({message:"Error creating a subtask!",error:error.message})
    }
})

// Adding Main task
router.post("/tasks", async(req ,res)=>{
    const {title, completed} = req.body
    
    try{
        const newTask = new MainTask({title, completed})
        await newTask.save();
        res.status(201).json(newTask);
    }
    catch(error){
        res.status(500).json({message: "Error creating task", error: error.message})
    }
})

// Getting all the main tasks
router.get("/tasks", async(req,res)=>{

    try{
        const tasks = await MainTask.find();
        res.status(200).json(tasks);

    }
    catch(error){
        res.status(500).json({message: "error fetching tasks", error: error.message})

    }
})
//Getting all tasks that are completed
router.get("/subtasksCompleted",async(req,res)=>{
    try{
        const completedTasks = await MainTask.aggregate([
            //unwinding the subtasks so that the 
            {$unwind : "$subTasks"},
            {
                $match:{
                    "subTasks.completed": true,
                    "subTasks.completedAt": {$ne: null}
                }
            },
            {
                $group:{
                    _id:{
                        date:{
                            $dateToString: {format: "%Y-%m-%d", date: "$subTasks.completedAt" }

                        }
                    },
                    count: {$sum:1}
                }
            },
            {
                $project:{
                    _id:0,
                    date:"$_id.date",
                    count:1
                }
            }
        ]);
        res.status(200).json(completedTasks)
    }catch(err){
        res.status(401).json({message:"Completed subtasks not recieved!"})
    }
})
//edit subtask
router.patch("/:taskId/subtasks/:subTaskId", async(req,res)=>{
    console.log("Received body:", req.body);
    const {taskId, subTaskId} = req.params;
    const {title, completed} = req.body
    console.log("taskId:", taskId);
    console.log("subTaskId:", subTaskId);
    

    try{
        const mainTask = await MainTask.findById(taskId)
        if(!mainTask) return res.status(404).json({message:"Task is not present!"})

        const subTask = mainTask.subTasks.id(subTaskId)
        if(!subTask){
            return res.status(404).json({message: "Subtask not updated!"})
        }
        if(title !== undefined) subTask.title = title;
        if(completed !== undefined){
            subTask.completed = completed;
            
            subTask.completedAt = completed ? new Date() : null;
            console.log("date of subtask completed: ", subTask.completedAt)

        } 

        console.log("Updating subtask to:", subTask);
        await mainTask.save();
        res.status(200).json(subTask)
    }
    catch(err){
        console.log("error updating task: ",err)
        res.status(500).json({message:"Subtask not updated!!"})
    }

})

//edit mainTask
router.patch("/edit/:taskid", async(req,res)=>{
    const taskid = req.params.taskid
    const {title, completed} = req.body
    try{

        const updatedTask = await MainTask.findByIdAndUpdate(
            taskid,
            { $set: {title, completed}},
            {new:true}

        )
        if(!updatedTask) res.status(404).json({message:"Updating task unsuccessful!"})

        res.status(200).json({message: "Task updated successfully",updatedTask})

    }
    catch(err){
        res.status(500).json({message:"Task not updated!", error: err.message})

    }

})

//Deleting the task
router.delete("/:id",async(req,res)=>{
    const id = req.params.id
    try{
        const deletedTask = await MainTask.findByIdAndDelete(id)

        if(!deletedTask){
            return res.status(404).json({message: "Main task not found."})
        }
        res.status(200).json({message:"Task deleted successfully !"})

         

    } catch(err){
        res.status(500).json({message:"Error deleting Task!", error: err.message})
    }
})

module.exports = router;