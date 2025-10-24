import { useNavigate } from "react-router-dom";

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
            style={{
                border: "1px solid gray",
                borderRadius: "8px",
                padding: "10px",
                width: "180px",
                // Show pointer cursor only when interactive
                cursor: clickable ? "pointer" : "default",
                textAlign: "center",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
                // Slightly dim and disable pointer events when not clickable
                opacity: clickable ? 1 : 0.65,
                pointerEvents: clickable ? "auto" : "none",
            }}
        >
            {/* Placeholder circular thumbnail for the user */}
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#ccc",
                    borderRadius: "50%",
                    margin: "0 auto 10px auto",
                }}
            ></div>

            {/* Show the user's id as a simple title */}
            <h4>User #{user._id || user.id}</h4>
            {/* Display preview information when available */}
            {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
            {user.height && <p><strong>Height:</strong> {user.height} cm</p>}
            {user.weight && <p><strong>Weight:</strong> {user.weight} kg</p>}
            {user.kink && <p><strong>Kink:</strong> {user.kink}</p>}
        </div>
    );
}

