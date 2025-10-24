
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Styles/NavBar.css";

function Navbar({ onReload }) {
        
        const navigate = useNavigate();
        
        const { id } = useParams();
    
    const { logout, cookies, user } = useAuth();
    
    const currentUserId = user?.id ?? cookies?.userId;

        
        function handleLogout() {
               
                logout();
                navigate("/login");
            }

    return (
        <nav className="navbar">
            <h2 onClick={() => {
                navigate('/');
                if (onReload) onReload();
            }} style={{ cursor: 'pointer' }}>ReviewApp</h2>

            <div>
                {/* Profile button */}
                {currentUserId && (
                    <button onClick={() => navigate(`/profile/${currentUserId}`)}>
                        My Profile
                    </button>
                )}

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