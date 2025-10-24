// NavBar.jsx
// Top navigation bar shown on most pages. Contains the app title (clickable
// to trigger a reload/shuffle on the Home page), a placeholder Chats button,
// and a Logout button that calls the AuthContext logout helper.
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Styles/NavBar.css";

function Navbar({ onReload }) {
        // Programmatic navigation helper
        const navigate = useNavigate();
        // Get the current URL params to check if we're on a profile page
        const { id } = useParams();
    // Get the logout function and user info from our AuthContext
    const { logout, cookies, user } = useAuth();
    // Prefer the in-memory `user` id, fall back to cookie if present
    const currentUserId = user?.id ?? cookies?.userId;

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
            {/* Clicking the title goes to home and triggers reload if provided */}
            <h2 onClick={() => {
                navigate('/');
                if (onReload) onReload();
            }} style={{ cursor: 'pointer' }}>ReviewApp</h2>

            <div>
                {/* Profile button - always show if user is logged in */}
                {currentUserId && (
                    <button onClick={() => navigate(`/profile/${currentUserId}`)}>
                        My Profile
                    </button>
                )}

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