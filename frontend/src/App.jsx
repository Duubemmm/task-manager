import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import Edit from './pages/Edit'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TaskProvider from './context/Taskprovider';
import SignUp from '../src/pages/SignUp'
// import { useNavigate } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)
 

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center border border-r-2">
        
        <div className="bg-white p-6 h-auto w-auto border shadow-lg rounded-lg">
          <TaskProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />}></Route >
                <Route path="/signup" element={<SignUp />}></Route >
                <Route path="/home" element={<Home />}></Route >
                <Route path="/edit" element={<Edit />}></Route >
              </Routes>
            </BrowserRouter>
          </TaskProvider>
        </div>
      </div>
    </>
  )
}

export default App



