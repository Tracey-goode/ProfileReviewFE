// App.jsx
// Main application router. Defines public and protected routes and wires
// them up to the appropriate page components. Protected pages require
// an authentication token (stored in cookies) to be visible.
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/register";
import Home from "./Pages/Home";
import ProfilePage from "./Pages/ProfilePage";
import { useAuth } from "./Components/AuthContext";

export default function App() {

 // Get auth cookies from our AuthContext. We check cookies.token to
 // determine if the user is currently authenticated.
 const { cookies } = useAuth();

 // ProtectedRoute is a small wrapper that only renders its children
 // when an authentication token exists. If no token is present we
 // redirect the visitor to the login page. This prevents unauthenticated
 // access to sensitive pages.
 const ProtectedRoute = ({ children }) => {
    return cookies?.token ? children : <Navigate to="/login" />;
  };

  return (
     // All application routes are declared below. Add new routes here.
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

