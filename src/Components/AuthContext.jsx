// AuthContext.jsx
// This file manages user authentication for the app using browser cookies.
// It provides `login`, `signUp`, and `logout` functions and exposes the
// current `user` and cookie `cookies` to any component that needs auth info.
// Using cookies (via react-cookie) is generally more secure than storing
// tokens in localStorage for this application.
import {useCookies} from 'react-cookie';
import{createContext, useState, useEffect, useContext} from 'react';
import axios from 'axios';

// Create a React Context to share authentication state and helpers
// across the whole component tree without prop drilling.
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // `useCookies` gives us helpers to read, set and remove cookies.
  // We store the authentication token in a cookie named "token".
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  // `user` holds the currently logged-in user's information (if any).
  const [user, setUser] = useState(null); // will be set only on login

  // Backend API base URL. If deploying, update this to the real backend.
  const connStr = "http://localhost:3000/api";

  // Login function
  // Accepts an object like { email, password } and sends it to the backend.
  // On success the backend returns a token and user info. We store the token
  // in a cookie (so it's automatically sent on same-site requests if configured)
  // and update `user` so the UI knows who's logged in.
  async function login(formData) {
    try {
      const res = await axios.post(`${connStr}/auth/login`, formData, {
        withCredentials: true,
      });

      // Store token in cookie so it can be used for authenticated requests.
      // We set path:"/" so the cookie is available across the whole app.
  setCookie("token", res.data.token, { path: "/" });
  // Also persist the user's id in a cookie for components that
  // rely on a cookie fallback when in-memory `user` is not set.
  setCookie("userId", res.data.user?.id, { path: "/" });

      // Save user details in state so components can render user-specific UI.
      setUser(res.data.user); // set user after login
    } catch (err) {
      console.error("Login failed", err.response?.data || err.message);
      throw err;
    }
  }

  // Register function
  // Similar to login but creates a new user account first. On success
  // the backend returns a token and user data which we save the same way.
  async function signUp(formData) {
    try {
      const res = await axios.post(`${connStr}/auth/register`, formData, {
        withCredentials: true,
      });

      // Save token and user after successful registration
  setCookie("token", res.data.token, { path: "/" });
  setCookie("userId", res.data.user?.id, { path: "/" });
  setUser(res.data.user);
    } catch (err) {
      console.error("Signup failed", err.response?.data || err.message);
      throw err;
    }
  }

  // Logout function
  // Removing the token cookie and clearing the user state fully logs
  // the current user out of the application.
  function logout() {
    // Remove both token and userId cookies and clear in-memory user
    removeCookie("token", { path: "/" });
    removeCookie("userId", { path: "/" });
    setUser(null);
  }

  // Provide auth helpers and state to children components via Context.
  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, cookies }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  // Custom hook for components to access authentication data and helpers.
  // Usage: const { user, login, logout, cookies } = useAuth();
  return useContext(AuthContext);
}