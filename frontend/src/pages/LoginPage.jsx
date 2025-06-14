import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", { email, password });

            setUser(res.data.user);

            if (res.data.user.isAdmin) {
                navigate("/admin/upload");
            } else {
                const redirectPath = localStorage.getItem("redirectAfterLogin");
                if (redirectPath) {
                    navigate(redirectPath);
                    localStorage.removeItem("redirectAfterLogin");
                } else {
                    navigate("/dashboard");
                }
            }
        } catch (err) {
            alert("Login failed: " + err.response?.data?.msg || "Server error");
        }

        // navigate("/jee/2022");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
                <h2 className="text-xl font-semibold text-center">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
    
}

export default LoginPage;