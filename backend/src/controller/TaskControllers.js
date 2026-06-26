import Task from '../models/Taskmodel.js'

// Create task
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title & Description required" });
        }

        const task = await Task.create(req.body);
        res.status(201).json(task);
        console.log("Fixed");

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Delete Task 

export const deleteTask = async (req, res) => {
    try {
        const deleteTask = await Task.findByIdAndDelete(req.params.id);

        if (!deleteTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ Message: " Task Deleted " });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Read task

export const getTask = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update task
export const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(updatedTask);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
