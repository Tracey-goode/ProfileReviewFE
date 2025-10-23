import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

export default function ProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchProfile() {
            try {
                // Fetch user info
                const userRes = await axios.get(`http://localhost:3000/api/user/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userRes.data);

                // Fetch reviews for this user
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

    if (loading) return <p style={{ textAlign: "center" }}>Loading profile...</p>;
    if (!user) return <p style={{ textAlign: "center" }}>User not found.</p>;

    return (
        <div>
            <Navbar onReload={() => { }} />

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                {/* Empty thumbnail */}
                <div
                    style={{
                        width: "120px",
                        height: "120px",
                        backgroundColor: "#ccc",
                        borderRadius: "50%",
                        margin: "0 auto 10px auto",
                    }}
                ></div>

                <h2>User #{user._id || user.id}</h2>
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


