import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            navigate("/home");
        } catch (error) {
            console.log(error);
            alert("Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-1">Login to continue to your task app</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
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
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-md font-medium transition disabled:opacity-70"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-5">
                    Don&apos;t have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-orange-500 font-medium cursor-pointer hover:underline"
                    >
                        Create Account
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Login;