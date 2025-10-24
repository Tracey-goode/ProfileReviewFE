
import {useCookies} from 'react-cookie';
import{createContext, useState, useEffect, useContext} from 'react';
import axios from 'axios';


const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

 
  const [user, setUser] = useState(null);


  const connStr = "http://localhost:3000/api";

  async function login(formData) {
    try {
      const res = await axios.post(`${connStr}/auth/login`, formData, {
        withCredentials: true,
      });

    
  setCookie("token", res.data.token, { path: "/" });

  setCookie("userId", res.data.user?.id, { path: "/" });

     
      setUser(res.data.user); 
    } catch (err) {
      console.error("Login failed", err.response?.data || err.message);
      throw err;
    }
  }


  async function signUp(formData) {
    try {
      const res = await axios.post(`${connStr}/auth/register`, formData, {
        withCredentials: true,
      });

      
  setCookie("token", res.data.token, { path: "/" });
  setCookie("userId", res.data.user?.id, { path: "/" });
  setUser(res.data.user);
    } catch (err) {
      console.error("Signup failed", err.response?.data || err.message);
      throw err;
    }
  }

 
  function logout() {
 
    removeCookie("token", { path: "/" });
    removeCookie("userId", { path: "/" });
    setUser(null);
  }

  
  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, cookies }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  return useContext(AuthContext);
}