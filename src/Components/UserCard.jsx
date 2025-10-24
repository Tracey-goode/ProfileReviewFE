import { useNavigate } from "react-router-dom";
import "../Styles/Homepage.css";


export default function UserCard({ user }) {

    const navigate = useNavigate();
   
    const userId = user?._id ?? user?.id;

    const clickable = !!userId;

        return (
        <div
   
            onClick={clickable ? () => navigate(`/profile/${userId}`) : undefined}
           
            role={clickable ? "button" : undefined}
            className="user-card"
            style={{
                
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

