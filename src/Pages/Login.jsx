import { useState, useContext } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Components/AuthContext";
import "../Styles/login.css";

export default function Login() {
    const {setUser, setToken} = useContext(AuthContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {

            const res = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password,
            });
            setToken(res.data.token);
            setUser(res.data.user); 
            // ✅ Navigate to homepage
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            /><br />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            /><br />
            <button type="submit">Login</button>
        </form>
    );
}

