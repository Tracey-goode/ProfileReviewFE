// ProfilePage.jsx
// Displays a single user's profile information and all reviews they've
// received. The page fetches both the user's data and their visible reviews
// from the backend using the ID from the URL.
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/NavBar";
import { useAuth } from "../Components/AuthContext";
import axios from "axios";
import "../Styles/Profile.css";

export default function ProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const { cookies, user: authUser } = useAuth();
    const token = cookies?.token;
    const currentUserId = authUser?.id ?? cookies?.userId;
    const isOwnProfile = currentUserId === id;

    useEffect(() => {
        async function fetchProfile() {
            try {
                const userRes = await axios.get(`http://localhost:3000/api/user/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userRes.data);

                const reviewsRes = await axios.get(`http://localhost:3000/api/reviews/${id}`, {
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

    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ bio: "", height: "", weight: "", kink: "" });

    async function handlePostReview(e) {
        e.preventDefault();
        setError("");
        if (!text.trim()) {
            setError("Please enter a review message.");
            return;
        }

        try {
            setPosting(true);
            await axios.post(
                "http://localhost:3000/api/reviews",
                { reviewedUserId: id, rating, text },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const reviewsRes = await axios.get(`http://localhost:3000/api/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(reviewsRes.data);
            setText("");
            setRating(5);
        } catch (err) {
            console.error("Failed to post review", err);
            setError("Failed to post review.");
        } finally {
            setPosting(false);
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        try {
            const updateData = {
                ...(editForm.bio?.trim() && { bio: editForm.bio.trim() }),
                ...(editForm.height && { height: Number(editForm.height) }),
                ...(editForm.weight && { weight: Number(editForm.weight) }),
                ...(editForm.kink?.trim() && { kink: editForm.kink.trim() })
            };

            const response = await axios.put(
                `http://localhost:3000/api/user/profile`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data.user ?? response.data);
            setIsEditing(false);
            setError("");
        } catch (err) {
            console.error("Failed to update profile", err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to update profile. Please try again.");
            }
        }
    }

    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editReviewText, setEditReviewText] = useState("");
    const [editReviewRating, setEditReviewRating] = useState(5);

    function handleEditClick(review) {
        const reviewerId = review.reviewerId?._id ?? review.reviewerId ?? review.reviewer;
        if (reviewerId !== currentUserId) return;
        setEditingReviewId(review._id || review.id);
        setEditReviewText(review.text || "");
        setEditReviewRating(review.rating || 5);
        setError("");
    }

    function handleCancelEdit() {
        setEditingReviewId(null);
        setEditReviewText("");
        setEditReviewRating(5);
    }

    async function handleSaveEdit(reviewId) {
        try {
            const payload = { rating: editReviewRating, text: editReviewText.trim() };

            const res = await axios.put(`http://localhost:3000/api/reviews/${reviewId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updated = res.data.review ?? res.data;
            setReviews((prev) => prev.map((r) => ((r._id || r.id) === (updated.id || updated._id || updated.id) ? {
                ...r,
                rating: updated.rating,
                text: updated.text,
                createdAt: updated.createdAt || r.createdAt,
            } : r)));

            handleCancelEdit();
        } catch (err) {
            console.error("Failed to save edited review", err);
            setError("Failed to save changes to review.");
        }
    }

    async function handleReport(reviewId) {
        try {
            await axios.put(`http://localhost:3000/api/reviews/report/${reviewId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews((prev) => prev.filter((r) => (r._id || r.id) !== reviewId));
        } catch (err) {
            console.error("Failed to report review", err);
            alert("Failed to report review.");
        }
    }

    async function handleDelete(reviewId) {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

        try {
            await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews((prev) => prev.filter((r) => (r._id || r.id) !== reviewId));
        } catch (err) {
            console.error("Failed to delete review", err);
            alert("Failed to delete review. Please try again.");
        }
    }

    if (loading) return <p style={{ textAlign: "center" }}>Loading profile...</p>;
    if (!user) return <p style={{ textAlign: "center" }}>User not found.</p>;

    return (
        <div>
            <Navbar onReload={() => { }} />

            <div className="profile-container" style={{ boxShadow: '5px', background: 'transparent', borderRadius: '12px', padding: '20px' }}>
                <div style={{ width: "120px", height: "120px", backgroundColor: "#ddd", borderRadius: "4px", margin: "0 auto 10px auto" }}></div>

                {isOwnProfile && (
                    <button onClick={() => {
                        if (!isEditing) {
                            setEditForm({ bio: user.bio || "", height: user.height || "", weight: user.weight || "", kink: user.kink || "" });
                        }
                        setIsEditing(!isEditing);
                        setError("");
                    }} style={{ margin: "8px 0", background: 'transparent', border: '1px solid #ccc', padding: '6px 10px' }}>
                        {isEditing ? "Nevermind" : "Edit Profile?"}
                    </button>
                )}

                {isEditing ? (
                    <form onSubmit={handleUpdate} style={{ maxWidth: "400px", margin: "0 auto" }}>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Bio:</label>
                            <textarea value={editForm.bio} onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))} style={{ width: "100%", marginTop: "5px" }} rows={3} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Height (cm):</label>
                            <input type="number" value={editForm.height} onChange={(e) => setEditForm(prev => ({ ...prev, height: e.target.value }))} style={{ width: "100%", marginTop: "5px" }} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Weight (kg):</label>
                            <input type="number" value={editForm.weight} onChange={(e) => setEditForm(prev => ({ ...prev, weight: e.target.value }))} style={{ width: "100%", marginTop: "5px" }} />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Kink:</label>
                            <input type="text" value={editForm.kink} onChange={(e) => setEditForm(prev => ({ ...prev, kink: e.target.value }))} style={{ width: "100%", marginTop: "5px" }} />
                        </div>
                        <button type="submit" style={{ marginTop: "10px", background: 'transparent', border: '1px solid #aaa', padding: '6px 10px' }}>Save</button>
                    </form>
                ) : (
                    <div>
                        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                        {user.height && <p><strong>Height:</strong> {user.height} cm</p>}
                        {user.weight && <p><strong>Weight:</strong> {user.weight} kg</p>}
                        {user.kink && <p><strong>Kink:</strong> {user.kink}</p>}
                    </div>
                )}

                <div style={{ maxWidth: "600px", margin: "10px auto", textAlign: "left", background: 'transparent' }}>
                    <h3>Reviews </h3>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handlePostReview}>
                        <label>
                            Rating:
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ marginLeft: "8px" }}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </select>
                        </label>
                        <div style={{ marginTop: "8px" }}>
                            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your experience..." rows={4} style={{ width: "100%" }} />
                        </div>
                        <div style={{ marginTop: "8px", textAlign: "right" }}>
                            <button type="submit" disabled={posting} style={{ padding: "6px 12px", background: 'transparent', border: '1px solid #aaa' }}>{posting ? "Posting..." : "Post"}</button>
                        </div>
                    </form>
                </div>

                <h3>Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((r) => {
                        const reviewId = r._id || r.id;
                        const reviewerId = r.reviewerId?._id ?? r.reviewerId ?? r.reviewer;
                        const isAuthor = reviewerId === currentUserId;

                        return (
                            <div key={reviewId} className="review" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: 'transparent', boxShadow: 'none', borderRadius: 0, border: '1px solid #eee', padding: '10px' }}>
                                <div style={{ width: "100%" }}>
                                    {editingReviewId === reviewId ? (
                                        <div>
                                            <label style={{ display: "block", marginBottom: "6px" }}><strong>Rating:</strong></label>
                                            <select value={editReviewRating} onChange={(e) => setEditReviewRating(Number(e.target.value))} style={{ marginBottom: "8px" }}>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                            </select>
                                            <div>
                                                <textarea value={editReviewText} onChange={(e) => setEditReviewText(e.target.value)} rows={3} style={{ width: "100%", marginTop: "6px" }} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p style={{ margin: 0 }}><strong>Rating:</strong> {r.rating || "-"}</p>
                                            <p style={{ margin: 0 }}> {r.text || ""}</p>
                                            <p style={{ margin: 0, fontSize: "0.9em", color: "#666" }}>{new Date(r.createdAt).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginLeft: "12px" }}>
                                    {editingReviewId === reviewId ? (
                                        <>
                                            <button onClick={() => handleSaveEdit(reviewId)} style={{ padding: "6px 10px", marginRight: "6px" }}>Save</button>
                                            <button onClick={handleCancelEdit} style={{ padding: "6px 10px" }}>Nevermind</button>
                                        </>
                                    ) : (
                                        <>
                                            {isAuthor ? (
                                                <>
                                                    <button onClick={() => handleEditClick(r)} style={{ padding: "6px 10px", marginRight: "6px", background: 'transparent', border: '1px solid #ccc' }}>Edit</button>
                                                    <button onClick={() => handleDelete(reviewId)} style={{ padding: "6px 10px", marginRight: "6px", background: '#fcc', border: '1px solid #faa' }}>Delete</button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleReport(reviewId)} style={{ padding: "6px 10px", marginRight: "6px", background: 'transparent', border: '1px solid #ccc' }}>Report</button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}


