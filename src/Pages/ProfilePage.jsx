// ProfilePage.jsx
// Displays a single user's profile information and all reviews they've
// received. The page fetches both the user's data and their visible reviews
// from the backend using the ID from the URL.
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/NavBar";
import { useAuth } from "../Components/AuthContext";
import axios from "axios";

// Profile page component
export default function ProfilePage() {
    // `id` is read from the URL, e.g. /profile/123 -> id === "123"
    const { id } = useParams();
    // Holds the profile information for the user we're viewing
    const [user, setUser] = useState(null);
    // Holds reviews written about this user
    const [reviews, setReviews] = useState([]);
    // Loading indicator while fetching data
    const [loading, setLoading] = useState(true);
    // Get auth token from cookies so API calls are authenticated
    const { cookies } = useAuth();
    const token = cookies?.token;

    // Fetch the user's profile and their visible reviews when the
    // component mounts or when the ID/token changes.
    useEffect(() => {
        async function fetchProfile() {
            try {
                // Fetch user info by ID
                const userRes = await axios.get(`http://localhost:3000/api/user/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userRes.data);

                // Fetch reviews for this user (only visible ones)
                const reviewsRes = await axios.get(`http://localhost:3000/api/reviews?reviewedUserID=${id}&status=visible`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(reviewsRes.data);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }

        fetchProfile();
    }, [id, token]);

    // Show friendly messages for loading / not found states
    if (loading) return <p style={{ textAlign: "center" }}>Loading profile...</p>;
    if (!user) return <p style={{ textAlign: "center" }}>User not found.</p>;

    return (
        <div>
            {/* Navbar is shown at the top; on profile pages we don't need reload */}
            <Navbar onReload={() => { }} />

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                {/* Placeholder circular thumbnail for the user's avatar */}
                <div
                    style={{
                        width: "120px",
                        height: "120px",
                        backgroundColor: "#ccc",
                        borderRadius: "50%",
                        margin: "0 auto 10px auto",
                    }}
                ></div>

                {/* Display user's ID as their title */}
                <h2>User #{user._id || user.id}</h2>
                {/* Show optional fields if they exist */}
                {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                {user.height && <p><strong>Height:</strong> {user.height} cm</p>}
                {user.weight && <p><strong>Weight:</strong> {user.weight} kg</p>}
                {user.kink && <p><strong>Kink:</strong> {user.kink}</p>}

                <h3>Reviews Received</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((r) => (
                        <div key={r._id || r.id} style={{ borderTop: "1px solid #ccc", padding: "5px" }}>
                            <p><strong>{r.reviewerName || "Anonymous"}:</strong> {r.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


