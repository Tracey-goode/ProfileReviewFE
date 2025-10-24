import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Styles/NavBar.css";

function Navbar({ onReload }) {
        const navigate = useNavigate();
        const { logout } = useAuth();

        function handleLogout() {
                // Use AuthContext logout to clear cookie and user state
                logout();
                navigate("/login");
            }

    return (
        <nav className="navbar">
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