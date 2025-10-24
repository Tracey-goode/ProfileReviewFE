// NavBar.jsx
// Top navigation bar shown on most pages. Contains the app title (clickable
// to trigger a reload/shuffle on the Home page), a placeholder Chats button,
// and a Logout button that calls the AuthContext logout helper.
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Styles/NavBar.css";

function Navbar({ onReload }) {
        // Programmatic navigation helper
        const navigate = useNavigate();
        // Get the logout function from our AuthContext to clear cookies and state
        const { logout } = useAuth();

        // Called when the Logout button is clicked. Uses the AuthContext
        // logout helper to remove the authentication cookie and clear user state,
        // then redirects the user to the login page.
        function handleLogout() {
                // Use AuthContext logout to clear cookie and user state
                logout();
                navigate("/login");
            }

    return (
        <nav className="navbar">
            {/* Clicking the title triggers the onReload callback (used on Home) */}
            <h2 onClick={onReload}>ReviewApp</h2>

            <div>
                {/* Chats is not implemented yet - show a friendly message */}
                <button onClick={() => alert("Chats not available yet")}>
                    Chats
                </button>

                {/* Logout clears auth state and navigates to login */}
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;