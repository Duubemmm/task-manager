import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api.js'

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await API.post('/auth/signup', {
                name,
                email,
                password
            });

            alert("Registration Successful");
            navigate("/");
        } catch (error) {
            console.log(error);
            alert("Registration Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[80vh] bg-gray-100 flex items-center justify-center px-4 n">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Create Account</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign up to manage your tasks</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-md font-medium transition disabled:opacity-70"
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-md font-medium hover:bg-gray-100 transition"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp;