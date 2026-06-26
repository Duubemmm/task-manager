import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskContext from '../context/Taskcontext'
import Dropdown from '../component/Dropdown';
import API from '../api.js';

const Home = () => {
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState(false);

    const [pop, setPop] = useState(false);

    const [selected, setSelected] = useState("All Tasks");
    const [selectOrder, setSelectedOrder] = useState("Select Order");

    const allTaskOptions = ["All Tasks", "In Progress", "Done"];
    const orderOfTasks = ["Newest First", "Oldest First"];

    // const [task, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [status, setStatus] = useState("To Do");
    const allStatus = ['To Do', 'In Progress', 'Done'];

    const [priority, setPriority] = useState("Medium");
    const allPriorities = ['High', 'Medium', 'Low'];

    const [date, setDate] = useState("");

    const [search, setSearch] = useState("");

    const { task, setTask, setEditTask } = useContext(TaskContext);

    const navigate = useNavigate();

    const sortedTask = [...task];

    let finalTasks = [...task];


    if (search) {
        // Searching
        finalTasks = finalTasks.filter((t) =>
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase())
        );

    }

    // Status filter

    if (selected === "In Progress") {
        finalTasks = finalTasks.filter((t) => t.status === "In Progress");
    } else if (selected === "Done") {
        finalTasks = finalTasks.filter((t) => t.status === "Done");
    }

    // sorting
    if (selectOrder == "Newest First") {
        finalTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (selectOrder == "Oldest First") {
        finalTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    useEffect(() => {
        getTask();
    }, [])

    const getTask = async () => {
        try {

            const res = await API.get("/tasks"); // API to get tasks
            setTask(res.data);
            console.log("Task comming...");

        } catch (error) {
            console.log("error", error.message);
        }
    }

    const addTask = async () => {

        if (!title.trim() || !description.trim()) {
            window.alert("Both fields are required");
        } else {

            try {
                const res = await API.post("/tasks", { // Create Task
                    title: title,
                    description: description,
                    status: status,
                    priority: priority,
                    date: date
                });

                setTask((prev) => { return [...prev, res.data] });

                setTitle("");
                setDescription("");
                setStatus("To Do");
                setPriority("Medium");
                setPop(false);

            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleEdit = (item) => {
        setEditTask(item);
        navigate("/edit");
    }

    const deleteTask = async (id) => {

        if (!window.confirm('Are you sure you want to delete ?')) return;

        try {
            await API.delete(`/tasks/${id}`);
            setTask(prev => prev.filter(t => t._id !== id));

        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };


    return (

        <div className="min-w-full flex justify-center">

            <div className="absolute w-full top-0 h-[40px] flex justify-between px-14 items-center bg-white shadow-md">
                <div className="font-serif text-bold">Task App</div>
                <button type="button" onClick={handleLogout} className="px-3 border rounded-md text-[16px] font-serif hover:bg-gray-100">
                    Logout
                </button>
            </div>

            <div className="w-full bg-blue-500 relative">

                <div className="bg-white w-[300px] h-auto">

                    <section className="flex flex-col w-auto h-auto gap-y-1">
                        <input
                            type="text"
                            placeholder="Search task..."
                            value={search}
                            className="border rounded-md h-[27px] text-sm pl-2 shadow-sm font-extralight outline-none  hover:shadow-md"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="rounded-lg border h-9 mt-1 bg-orange-500 text-white font-medium hover:bg-orange-600" onClick={() => { setPop(!pop) }}> <span className="pr-1 font-bold text-[20px]">+</span>New Task</button>

                    </section>


                    {/* All Tasks */}
                    <section className="relative">
                        <button onClick={() => { setOpen(!open); setOrder(false); }} className="w-full h-[28px] flex justify-between items-center px-2 border-2 outline-none rounded-md mt-3 " >
                            <span className="text-[14px] font-serif " >{selected}</span>
                            <span className="text-sm" >^</span>
                        </button>

                        {
                            open && (
                                <section className="relative">
                                    <ul className="absolute w-full h-auto border rounded-md font-serif bg-white mt-0 px-2">
                                        {
                                            allTaskOptions.map((option, index) => (
                                                <li className="mt-1 mb-2 cursor-pointer hover:shadow-md text-[15px]"
                                                    key={index}
                                                    onClick={() => {
                                                        setSelected(option)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {option}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </section>
                            )
                        }

                        {/* Selected order */}
                        <button onClick={() => {
                            setOrder(!order);
                            setOpen(false);
                        }
                        }
                            className="w-full h-[28px] flex justify-between items-center px-2 border-2 outline-none rounded-md mt-3 " >
                            <span className="text-[14px] font-serif" >{selectOrder}</span>
                            <span className="text-sm" >^</span>
                        </button>

                        {order && (
                            <section className="relative">
                                <ul className="absolute w-full h-auto border rounded-md font-serif bg-white mt-0 px-2">
                                    {
                                        orderOfTasks.map((orders) => (
                                            <li className="mt-1 mb-2 cursor-pointer hover:shadow-md text-[15px]"
                                                key={orders}
                                                onClick={
                                                    () => {
                                                        setSelectedOrder(orders)
                                                        setOrder(false)
                                                    }
                                                }
                                            >{orders}</li>
                                        ))
                                    }
                                </ul>
                            </section>
                        )}
                    </section>


                    {
                        pop && (
                            <div
                                onClick={() => setPop(false)}
                                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
                            >

                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white w-full max-w-md rounded-xl shadow-lg p-6"
                                >

                                    <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                                        New Task
                                    </h1>

                                    {/* Title */}
                                    <input
                                        type="text"
                                        placeholder="Enter Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 outline-none focus:border-orange-400"
                                    />

                                    {/* Description */}
                                    <textarea
                                        placeholder="Enter Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="4"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 resize-none outline-none focus:border-orange-400"
                                    />

                                    {/* Status */}
                                    <div className="mb-4">
                                        <Dropdown
                                            options={allStatus}
                                            value={status}
                                            setValue={setStatus}
                                        />
                                    </div>

                                    {/* Priority */}
                                    <div className="mb-4">
                                        <Dropdown
                                            options={allPriorities}
                                            value={priority}
                                            setValue={setPriority}
                                        />
                                    </div>

                                    {/* Date */}
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 outline-none focus:border-orange-400"
                                    />

                                    {/* Buttons */}
                                    <div className="flex gap-3">

                                        <button
                                            onClick={addTask}
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition"
                                        >
                                            Add Task
                                        </button>

                                        <button
                                            onClick={() => setPop(false)}
                                            className="w-full border border-gray-400 py-2 rounded-md hover:bg-gray-100 transition"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>
                            </div>
                        )
                    }

                    <div className="h-[270px] mt-2 overflow-y-auto no-scrollbar ">
                        {
                            Array.isArray(task) && (

                                finalTasks.length > 0 ? (


                                    finalTasks.map((task, index) => (
                                        <div key={task._id} className="border px-2 py-2 mt-4 rounded h-auto bg-blue-100 shadow-lg">
                                            <label htmlFor="title" className="font-medium text-[16px]">Title :</label>
                                            <h3 id="title" className="font-serif text-[18px] ">{task.title}</h3>

                                            <label htmlFor="description" className="font-medium my-1" >Description :</label>
                                            <p className="font-serif">{task.description.length > 50 ? task.description.slice(0, 20) + "..." : task.description}</p>

                                            <div className="mt-2 flex flex-col">
                                                <p className="text-[15px]"><span className="font-medium text-[15px]">Status : </span> {task.status} </p>
                                                <p className="text-[15px]"><span className="font-medium text-[15px]">Priority : </span> {task.priority}</p>
                                                <p className="text-[15px]"><span className="font-medium text-[15px]">Date : </span> {task.date ? new Date(task.date).toLocaleDateString() : "No date"}</p>
                                            </div>

                                            <div className="w-full flex flex-row gap-2">
                                                <button className="bg-yellow-500 hover:bg-yellow-600  w-full mt-2 rounded-md text-[15px]" onClick={() => { handleEdit(task) }}>Edit</button>
                                                <button className="bg-red-400 hover:bg-red-500 w-full mt-2 rounded-md text-[15px]" onClick={() => { deleteTask(task._id) }}>Delete</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (

                                    // 3. Fallback message shown when finalTasks is empty
                                    <div className="flex flex-col items-center justify-center p-6 mt-4 border border-dashed border-gray-400 rounded-md bg-gray-50 text-center">
                                        <p className="text-red-600 font-bold text-lg">Not found!</p>
                                        <p className="text-gray-500 text-xs mt-1">No tasks match your search or filter options.</p>
                                    </div>
                                )
                            )
                        }
                    </div>

                </div >
            </div>
        </div>

    )
}

export default Home;






