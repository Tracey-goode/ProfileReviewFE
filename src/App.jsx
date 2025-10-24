import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/register";
import Home from "./Pages/Home";
import ProfilePage from "./Components/UserCard";
import { AuthContext } from "./Components/AuthContext";

export default function App() {

 const { token } = useContext(AuthContext);

 const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
     <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      
      <Route path="/home" element={
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/profile/:id" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>} />
    </Routes>
  );
}

