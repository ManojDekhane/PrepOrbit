import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await API.post("/auth/register", form);
            navigate("/login");
        } catch (err) {
            alert("Registration failed: " + err.response?.data?.msg || "Server error");
        }
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <h2>Register</h2>
                <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default RegisterPage;