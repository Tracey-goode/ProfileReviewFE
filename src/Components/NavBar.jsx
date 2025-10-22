import { useNavigate } from "react-router-dom";
import "../Styles/Navbar.css";

function Navbar({ onReload }) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("user"); 
        navigate("/");
      }

    return (
        <nav classNAme="navbar">
            <h2 onClick={onReload}>ReviewApp</h2>

            <div>
                <button onClick={() => alert("Chats not available yet")}>
                    Chats
                </button>

                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;