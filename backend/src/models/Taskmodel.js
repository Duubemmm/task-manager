import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'To do'
    },
    priority: {
        type: String,
        default: 'Medium'
    },
    date: {
        type: Date,
        required: true
    }

}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;



