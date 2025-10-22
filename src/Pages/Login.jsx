import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backEnd from "../Components/backEndApi/BackEnd";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await backEnd.loginUser(email, password);

            // JSON server will return an array of matching users
            if (res.data.length > 0) {
                const user = res.data[0];
                console.log("Logged in user:", user);

                // Store user info (simple localStorage for now)
                localStorage.setItem("user", JSON.stringify(user));

                // Navigate to home page
                navigate("/home");
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            console.error("Login error:", err.message);
            setError("An error occurred during login");
        }
    }

    return (
        <div className="login-page">
            <h2>Login</h2>

            <form onSubmit={handleSubmit} className="login-form">
                <label>Email:</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Password:</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
