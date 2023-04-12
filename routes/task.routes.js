const router = require("express").Router();
const mongoose = require("mongoose");

const Task = require("../models/Task.model");
const Project = require("../models/Project.model");



// POST /api/tasks
router.post("/tasks", (req, res, next) => {
    const { title, description, projectId } = req.body;

    const newTask = {
        title: title,
        description: description,
        project: projectId
    }

    Task.create(newTask)
        .then(taskFromDB => {
            return Project.findByIdAndUpdate(projectId, { $push: { tasks: taskFromDB._id } });
        })
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("error creating a new task", err);
            res.status(500).json({
                message: "error creating a new task",
                error: err
            });
        })
});


// DELETE /api/projects/:projectId  
router.delete('/tasks/:taskId', (req, res, next) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Task.findByIdAndRemove(taskId)
        .then(() => res.json({ message: `Task with ${taskId} is removed successfully.` }))
        .catch(err => {
            console.log("error deleting task", err);
            res.status(500).json({
                message: "error deleting task",
                error: err
            });
        })
});


module.exports = router;


