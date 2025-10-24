// register.jsx
// This page allows new users to create an account. It calls `signUp`
// from AuthContext and redirects to /home on success.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext.jsx";

// Register page component
export default function Register() {
  // get signUp helper to create new accounts
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Controlled form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Runs when the registration form is submitted. Calls signUp and
  // navigates to the home page on success or shows an error message.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signUp({ email, password });
      navigate("/home"); // go to homepage after signup
    } catch (err) {
      setError("Registration failed. Maybe email already exists?");
    }
  };

  // Render the registration form. Inputs are controlled by React state.
  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      {/* Show errors in red to help beginners understand what went wrong */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
