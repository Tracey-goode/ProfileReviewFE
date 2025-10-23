import { useNavigate } from "react-router-dom";

export default function UserCard({ user }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/user/${user._id || user.id}`)}
            style={{
                border: "1px solid gray",
                borderRadius: "8px",
                padding: "10px",
                width: "180px",
                cursor: "pointer",
                textAlign: "center",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
            }}
        >
            
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#ccc",
                    borderRadius: "50%",
                    margin: "0 auto 10px auto",
                }}
            ></div>

            <h4>User #{user._id || user.id}</h4>
            {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
            {user.height && <p><strong>Height:</strong> {user.height} cm</p>}
            {user.weight && <p><strong>Weight:</strong> {user.weight} kg</p>}
            {user.kink && <p><strong>Kink:</strong> {user.kink}</p>}
        </div>
    );
}

