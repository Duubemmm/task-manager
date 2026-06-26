import { useState } from 'react'
import TaskContext from './Taskcontext'

const TaskProvider = ({ children }) => {

    const [task, setTask] = useState([]);
    const [editTask, setEditTask] = useState(null);

    return (
        <TaskContext.Provider value={{ task, setTask, editTask, setEditTask }}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskProvider;

