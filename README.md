# MERN Task Management Application

A full-stack task management application built with the MERN stack. It allows users to create, update, search, sort, and delete tasks through a responsive React frontend connected to a REST API and MongoDB database.

## Features

- User authentication with signup and login
- Create, edit, and delete tasks
- Search tasks by title and description
- Filter tasks by status
- Sort tasks by date
- Assign priority and due dates to tasks
- Real-time UI updates after task actions

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Context API
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT
- bcryptjs

## Project Structure

```bash
frontend/
├── components/
├── context/
├── pages/
├── api.js
└── App.jsx

backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env.example
└── server.js
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-link>
cd <project-folder>
```

### 2. Install dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

## Environment Variables

Create a `.env` file inside the `backend` folder and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

## Run the Application

### Start backend server
```bash
cd backend
npm run dev
```

### Start frontend server
```bash
cd frontend
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Fetch all tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## What This Project Demonstrates

- Full-stack MERN development
- REST API design and integration
- MongoDB data modeling
- JWT-based authentication
- React state management with Context API
- Search, filter, and sorting functionality in a real-world CRUD application
