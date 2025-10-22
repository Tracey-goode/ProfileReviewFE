import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import backEnd from "./backEndApi/BackEnd";
import "../Styles/Profile.css"; // ✅ import the CSS file

function ProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [postedReviews, setPostedReviews] = useState([]);

    async function getData() {
        try {
            const userRes = await backEnd.getUserById(id);
            setUser(userRes.data);

            const reviewRes = await backEnd.reviewerID(id);
            setReviews(reviewRes.data);

            const postedRes = await backEnd.reviewedUserId(id);
            setPostedReviews(postedRes.data);
        } catch (err) {
            console.error("Error fetching profile data:", err.message);
        }
    }

    useEffect(() => {
        getData();
    }, [id]);

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <Navbar onReload={() => navigate("/home")} />

            <div className="profile-container">
                <div className="profile-card">
                    <h2>User Profile #{id}</h2>
                    <p><strong>Bio:</strong> {user.bio || "No bio provided"}</p>
                    <p><strong>Height:</strong> {user.height} cm</p>
                    <p><strong>Weight:</strong> {user.weight} kg</p>
                </div>

                <h3>Reviews Received</h3>
                {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet.</p>
                ) : (
                    <ul className="reviews-list">
                        {reviews.map((r) => (
                            <li key={r.id}>
                                ⭐ {r.rating}/5 — {r.text}
                            </li>
                        ))}
                    </ul>
                )}

                <h3>Reviews Posted</h3>
                {postedReviews.length === 0 ? (
                    <p className="no-reviews">No reviews posted.</p>
                ) : (
                    <ul className="reviews-list">
                        {postedReviews.map((r) => (
                            <li key={r.id}>
                                ⭐ {r.rating}/5 — {r.text}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
