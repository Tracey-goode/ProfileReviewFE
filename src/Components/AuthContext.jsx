import {useCookies} from 'react-cookie';
import{createContext, useState, useEffect} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState(null); // will be set only on login

  const connStr = "http://localhost:3000/api";

  // Login function
  async function login(formData) {
    try {
      const res = await axios.post(`${connStr}/auth/login`, formData, {
        withCredentials: true,
      });

      setCookie("token", res.data.token, { path: "/" });
      setUser(res.data.user); // set user after login
    } catch (err) {
      console.error("Login failed", err.response?.data || err.message);
      throw err;
    }
  }

  // Register function
  async function signUp(formData) {
    try {
      const res = await axios.post(`${connStr}/auth/register`, formData, {
        withCredentials: true,
      });

      setCookie("token", res.data.token, { path: "/" });
      setUser(res.data.user);
    } catch (err) {
      console.error("Signup failed", err.response?.data || err.message);
      throw err;
    }
  }

  // Logout function
  function logout() {
    removeCookie("token", { path: "/" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, cookies }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}