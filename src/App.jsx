import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/register";
import Home from "./Pages/Home";
import ProfilePage from "./Components/UserCard";

function App() {
  // get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        <Route path="/user/:id" element={user ? <ProfilePage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
