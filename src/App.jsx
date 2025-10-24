
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/register";
import Home from "./Pages/Home";
import ProfilePage from "./Pages/ProfilePage";
import { useAuth } from "./Components/AuthContext";

export default function App() {


 const { cookies } = useAuth();


 const ProtectedRoute = ({ children }) => {
    return cookies?.token ? children : <Navigate to="/login" />;
  };

  return (
     
     <Routes>
      {/* Root redirects to /home */}
      <Route path="/" element={<Navigate to="/home" />} />
      
      {/* Home is a protected page that lists all users */}
      <Route path="/home" element={
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>} />

      {/* Public pages: login and register */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Profile pages are protected and use a dynamic :id parameter */}
      <Route path="/profile/:id" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>} />
    </Routes>
  );
}

