import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "../Components/UserCard";
import Navbar from "../Components/NavBar";
import axios from "axios";

export default function Home() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Get stored token
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await axios.get("http://localhost:3000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`, // send token for auth
                    },
                });

                // Shuffle users randomly
                const shuffled = res.data.sort(() => Math.random() - 0.5);
                setUsers(shuffled);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users.");
                setLoading(false);
            }
        }

        fetchUsers();
    }, [token]);

    function handleReload() {
        // Shuffle again
        setUsers([...users].sort(() => Math.random() - 0.5));
    }

    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading users...</p>;

    return (
        <div>
            <Navbar onReload={handleReload} />
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "15px", marginTop: "20px" }}>
                {users.map((user) => (
                    <UserCard key={user._id || user.id} user={user} />
                ))}
            </div>
        </div>
    );
}

