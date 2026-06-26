import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskContext from '../context/Taskcontext';
import API from '../api.js'

const Edit = () => {

    const [openStatus, setOpenStatus] = useState(false);
    const [status, setStatus] = useState("Status");
    const allStatus = ["To Do", "In Progress", "Done"];

    const [open, setOpen] = useState(false);
    const [priority, setPriority] = useState("Priority");
    const allPriority = ["High", "Medium", "Low"];

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    const { task, setTask } = useContext(TaskContext);
    const { editTask } = useContext(TaskContext);

    const [date, setDate] = useState("");

    useEffect(() => {
        if (editTask) {
            setTitle(editTask.title);
            setDescription(editTask.description);
            setStatus(editTask.status || "Status");
            setPriority(editTask.priority || "Priority");
            setDate(editTask.date ? editTask.date.split("T")[0] : "");
        }
    }, [editTask]);

    const handleSave = async () => {
        try {
            const res = await API.put(`/tasks/${editTask._id}`, { // API for edit Task
                title,
                description,
                status,
                priority,
                date
            });

            const updateTask = task.map((t) =>
                t._id === editTask._id ? res.data : t
            );

            setTask(updateTask);
            navigate("/home");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-white h-auto w-[300px] shadow-lg">
            <h2 className="text-center mb-1">Edit Task</h2>
            <div className="flex flex-col mb-4 ">
                <label htmlFor="title" className="font-serif text-[18px]" >Title</label>
                <input type="text" id="title" value={title} className="mt-1 h-[29px] font-serif border-[2px] pl-1 rounded-md outline-none" onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="flex flex-col mb-4">
                <label htmlFor="description" className="font-serif text-[18px]">Description</label>
                <textarea className="mt-1 border-[2px] pl-1 font-serif text-[16px] rounded-md outline-none" id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            
            {/* Status */}
            <div className="relative mb-4">
                <button
                    type="button"
                    onClick={() => {
                        setOpenStatus(!openStatus);
                        setOpen(false);
                    }}
                    className="w-full h-[36px] px-3 bg-white border border-gray-300 rounded-md flex items-center justify-between"
                >
                    <span className="font-serif text-[17px]">Status :</span>
                    <span className="font-serif text-[16px]">{status} ^</span>
                </button>

                {openStatus && (
                    <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-20">
                        {allStatus.map((item, index) => (
                            <li
                                key={index}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setStatus(item);
                                    setOpenStatus(false);
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Priority */}
            <div className="relative mb-4">
                <button
                    type="button"
                    onClick={() => {
                        setOpen(!open);
                        setOpenStatus(false);
                    }}
                    className="w-full h-[36px] px-3 bg-white border border-gray-300 rounded-md flex items-center justify-between"
                >
                    <span className="font-serif text-[17px]">Priority :</span>
                    <span className="font-serif text-[16px]">{priority} ^</span>
                </button>

                {open && (
                    <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                        {allPriority.map((item, index) => (
                            <li
                                key={index}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setPriority(item);
                                    setOpen(false);
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Date */}
            <div className="flex flex-col mt-3 ">
                <label htmlFor="date" className="text-md font-serif mb-1">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    id="date"
                    name="date"
                    className="border-2 rounded outline-none h-[30px]"
                />
            </div>

            <div className="flex flex-col w-full gap-2 mt-6">
                <button className="w-full bg-orange-500 hover:bg-orange-600 rounded-md items-center h-[30px]" onClick={handleSave}>Save Changes</button>
                <button className="w-full border-2 border-black rounded-md hover:bg-gray-100" onClick={() => navigate('/home')}>Cancel</button>
            </div>
        </div >
    )
}

export default Edit;



