// Home.jsx
// The main landing page after login. It fetches and displays all users
// as cards. Clicking a user card navigates to their profile page where
// reviews can be seen.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "../Components/UserCard";
import Navbar from "../Components/NavBar";
import { useAuth } from "../Components/AuthContext";
import axios from "axios";

// Home page component
export default function Home() {
    // useNavigate is available for any additional programmatic navigation
    const navigate = useNavigate();

    // `users` stores the list fetched from the backend
    const [users, setUsers] = useState([]);
    // `loading` indicates whether we are currently fetching data
    const [loading, setLoading] = useState(true);
    // `error` stores friendly error messages for the UI
    const [error, setError] = useState("");

    // Get authentication token from cookies via AuthContext so our
    // API requests include a valid credential.
    const { cookies } = useAuth();
    const token = cookies?.token;

    // Fetch users when the component mounts or when the token changes.
    // This keeps the list up to date for the authenticated user.
    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await axios.get("http://localhost:3000/api/user/profile", {
                    headers: {
                        // Send the auth token in the Authorization header
                        Authorization: `Bearer ${token}`, // send token for auth
                    },
                });

                // Shuffle users randomly so the order changes on reload
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

    // Called when the app title is clicked in the navbar to reshuffle users
    function handleReload() {
        // Shuffle again
        setUsers([...users].sort(() => Math.random() - 0.5));
    }

    // While data is loading show a friendly loading message
    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading users...</p>;

    return (
        <div>
            {/* Navbar at the top with a reload handler */}
            <Navbar onReload={handleReload} />
            {/* Show an error message if fetching fails */}
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            {/* Display users in a responsive grid using flexbox. Each user
                is rendered as a UserCard component that links to their profile. */}
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "15px", marginTop: "20px" }}>
                {users.map((user) => (
                    <UserCard key={user._id || user.id} user={user} />
                ))}
            </div>
        </div>
    );
}

