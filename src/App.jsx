import { Router, Routes, Route } from "react-router-dom";
// import Login from "./components/Login";
import Home from "./Pages/Home";
import ProfilePage from "./Components/UserCard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user/:id" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;