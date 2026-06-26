import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import taskRoutes from './src/routes/taskRoutes.js'
import connectDB from './src/config/db.js'
import authRoute from './src/routes/authRoutes.js'

dotenv.config()
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // convert request body to json

// Routes
app.use("/api/tasks", taskRoutes);

app.use("/api/auth", authRoute);


// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})



