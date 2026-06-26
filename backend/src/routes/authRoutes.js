import express from 'express';
import { createTask, updateTask, deleteTask, getTask } from '../controller/TaskControllers.js'
import { registerUser, loginUser } from '../controller/Authcontroller.js';

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

export default router;







