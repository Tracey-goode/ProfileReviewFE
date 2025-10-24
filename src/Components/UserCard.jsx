import { useNavigate } from "react-router-dom";
import "../Styles/Homepage.css";

// UserCard.jsx
// Displays a single user's summary as a card. If the user has a valid
// identifier this card is clickable and navigates to /profile/{userId}.
export default function UserCard({ user }) {
    // useNavigate allows programmatic navigation when the card is clicked
    const navigate = useNavigate();
    // Support both MongoDB `_id` and generic `id` fields
    const userId = user?._id ?? user?.id;
    // Only make the card interactive if we have an ID to navigate to
    const clickable = !!userId;

        return (
        <div
            // Only attach an onClick handler when we have a valid userId
            onClick={clickable ? () => navigate(`/profile/${userId}`) : undefined}
            // role="button" improves keyboard/screen-reader affordance when clickable
            role={clickable ? "button" : undefined}
            className="user-card"
            style={{
                // Only dynamic bits remain inline: interactivity and opacity
                cursor: clickable ? "pointer" : "default",
                opacity: clickable ? 1 : 0.65,
                pointerEvents: clickable ? "auto" : "none",
            }}
        >
            {/* thumbnail for the user */}
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#ccc",
                    borderRadius: "50%",
                    margin: "0 auto 10px auto",
                }}
            ></div>
            {/* Display preview information when available */}
            {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
            {user.height && <p><strong>Height:</strong> {user.height} cm</p>}
            {user.weight && <p><strong>Weight:</strong> {user.weight} kg</p>}
            {user.kink && <p><strong>Kink:</strong> {user.kink}</p>}
        </div>
    );
}

