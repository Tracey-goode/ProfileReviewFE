import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext.jsx";
import "../Styles/login.css";


export default function Register() {
 
  const { signUp } = useAuth();
  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signUp({ email, password });
      navigate("/home"); 
    } catch (err) {
      setError("Registration failed. Maybe email already exists?");
    }
  };

 
  return (
    <div className="login-page">
      <h2>Register</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </form>

      <p style={{ marginTop: "20px" }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
