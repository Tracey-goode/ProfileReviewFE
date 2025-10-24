// Login.jsx
// This page allows users to sign into their account by providing
// their email and password. It uses `useAuth()` to call the `login`
// function and `useNavigate()` to redirect after successful login.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext.jsx";
import "../Styles/login.css";

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
      setError("Invalid email or password");
    }
  };

  // The rendered form below is controlled by React state. When the
  // user types, we update state so `handleSubmit` can send the values.
  return (
    <div className="login-page">
      <h2>Login</h2>
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

        <button type="submit">Login</button>
      </form>

      {/* Show a friendly error if login fails */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        <a href="/register">Register</a>
      </p>
    </div>
  );
}
