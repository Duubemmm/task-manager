import express from 'express';
import { createTask, updateTask, deleteTask, getTask } from '../controller/TaskControllers.js'
import protect from '../middleware/Authmiddleware.js'
import { registerUser, loginUser } from '../controller/Authcontroller.js';

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;







