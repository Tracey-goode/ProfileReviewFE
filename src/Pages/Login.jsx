// Login.jsx
// This page allows users to sign into their account by providing
// their email and password. It uses `useAuth()` to call the `login`
// function and `useNavigate()` to redirect after successful login.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext.jsx";

// Login page component
export default function Login() {
  // get the login helper from our AuthContext
  const { login } = useAuth();
  // useNavigate lets us redirect programmatically after login
  const navigate = useNavigate();

  // Controlled form state for the login inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Runs when the form is submitted. Prevents the browser's default
  // form behavior, calls the login function and navigates to /home on success.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      navigate("/home"); // go to homepage after login
    } catch (err) {
      // Show a simple error message for beginners; backend errors
      // may contain more details in console.
      setError("Invalid email or password");
    }
  };

  // The rendered form below is controlled by React state. When the
  // user types, we update state so `handleSubmit` can send the values.
  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
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

        <button type="submit">Login</button>
      </form>

      {/* Show a friendly error if login fails */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
