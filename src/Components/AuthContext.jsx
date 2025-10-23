import {useCookies} from 'react-cookie';
import{createContext, useState, useEffect} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [ cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [token, setToken] = useState(cookies.token || null);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        setToken(cookies.token || null);
    }, [cookies.token]);

    useEffect(() => {
        if(token) {
            setCookie("token", token, {path: "/", sameSite: "lax"});
        } else {
            removeCookie("token", {path: "/"});
        }
    }, [token, setCookie, removeCookie]);

    useEffect(() => {
        async function fetchUser() {
            if(!token) return;
            try{
                const res = await axios.get("http://localhost:3000/api/auth", {
                    headers: {Authorization: `Bearer ${token}`},
                    withCredentials: true,
                });
                setUser(res.data);
            } catch (err) {
                console.error("Auto-login failed");
                logout();
            }
        }
        fetchUser();
    }, [token]);
    
    const logout = () => {
        removeCookie("token", {path: "/"});
        setToken(null);
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{ token, setToken, user, setUser, logout}}>
            {children}
        </AuthContext.Provider>
    );
}