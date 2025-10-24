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
    // Get auth token and current user from AuthContext so API calls are authenticated
    const { cookies, user: authUser } = useAuth();
    const token = cookies?.token;
    // Prefer in-memory auth user id; fall back to cookie if present
    const currentUserId = authUser?.id ?? cookies?.userId;
    // Check if this is the current user's own profile
    const isOwnProfile = currentUserId === id;

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

    // Simple local state for submitting a new review 
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        bio: "",
        height: "",
        weight: "",
        kink: ""
    });

    // Submit a new review and then reload the visible reviews
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

            // Reload reviews after a successful post
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

    // Update profile handler (submits profile edits)
    async function handleUpdate(e) {
        e.preventDefault();
        try {
            // Convert height and weight to numbers and remove empty fields
            const updateData = {
                ...(editForm.bio?.trim() && { bio: editForm.bio.trim() }),
                ...(editForm.height && { height: Number(editForm.height) }),
                ...(editForm.weight && { weight: Number(editForm.weight) }),
                ...(editForm.kink?.trim() && { kink: editForm.kink.trim() })
            };
            
            // Backend exposes an authenticated route to update the current
            // user's profile at PUT /api/user/profile. The server uses the
            // token to identify the user, so we should call that endpoint
            // rather than attempting to update by URL id.
            const response = await axios.put(
                `http://localhost:3000/api/user/profile`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // The backend responds with { message, user: { ... } }
            // Prefer the nested user object when updating local state.
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

    // --- Review editing helpers (for reviews the current user posted) ---
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
            const payload = {
                rating: editReviewRating,
                text: editReviewText.trim(),
            };

            const res = await axios.put(`http://localhost:3000/api/reviews/${reviewId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update the review in local state. Backend returns { message, review }
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
            // Remove reported review from UI
            setReviews((prev) => prev.filter((r) => (r._id || r.id) !== reviewId));
        } catch (err) {
            console.error("Failed to report review", err);
            alert("Failed to report review.");
        }
    }

    async function handleDelete(reviewId) {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Remove deleted review from UI
            setReviews((prev) => prev.filter((r) => (r._id || r.id) !== reviewId));
        } catch (err) {
            console.error("Failed to delete review", err);
            alert("Failed to delete review. Please try again.");
        }
    }

    // Show friendly messages for loading / not found states
    if (loading) return <p style={{ textAlign: "center" }}>Loading profile...</p>;
    if (!user) return <p style={{ textAlign: "center" }}>User not found.</p>;

    return (
        <div>
            {/* Navbar is shown at the top; on profile pages we don't need reload */}
            <Navbar onReload={() => { }} />

            <div className="profile-container">
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

                
                {/* Toggle edit mode button - only shown on own profile */}
                {isOwnProfile && (
                    <button 
                        onClick={() => {
                            if (!isEditing) {
                                setEditForm({
                                    bio: user.bio || "",
                                    height: user.height || "",
                                    weight: user.weight || "",
                                    kink: user.kink || ""
                                });
                            }
                            setIsEditing(!isEditing);
                            setError(""); // Clear any previous errors
                        }}
                        style={{ margin: "10px 0" }}
                    >
                        {isEditing ? "Cancel Edit" : "Update Profile"}
                    </button>
                )}                {isEditing ? (
                    <form onSubmit={handleUpdate} style={{ maxWidth: "400px", margin: "0 auto" }}>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Bio:</label>
                            <textarea
                                value={editForm.bio}
                                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                style={{ width: "100%", marginTop: "5px" }}
                                rows={3}
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Height (cm):</label>
                            <input
                                type="number"
                                value={editForm.height}
                                onChange={(e) => setEditForm(prev => ({ ...prev, height: e.target.value }))}
                                style={{ width: "100%", marginTop: "5px" }}
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Weight (kg):</label>
                            <input
                                type="number"
                                value={editForm.weight}
                                onChange={(e) => setEditForm(prev => ({ ...prev, weight: e.target.value }))}
                                style={{ width: "100%", marginTop: "5px" }}
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label>Kink:</label>
                            <input
                                type="text"
                                value={editForm.kink}
                                onChange={(e) => setEditForm(prev => ({ ...prev, kink: e.target.value }))}
                                style={{ width: "100%", marginTop: "5px" }}
                            />
                        </div>
                        <button type="submit" style={{ marginTop: "10px" }}>Save Changes</button>
                    </form>
                ) : (
                    /* Show optional fields if they exist */
                    <div>
                        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                        {user.height && <p><strong>Height:</strong> {user.height} cm</p>}
                        {user.weight && <p><strong>Weight:</strong> {user.weight} kg</p>}
                        {user.kink && <p><strong>Kink:</strong> {user.kink}</p>}
                    </div>
                )}

                {/* Review submission form */}
                <div style={{ maxWidth: "600px", margin: "10px auto", textAlign: "left" }}>
                    <h3>Write a Review</h3>
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
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Share your experience..."
                                rows={4}
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div style={{ marginTop: "8px", textAlign: "right" }}>
                            <button type="submit" disabled={posting} style={{ padding: "6px 12px" }}>
                                {posting ? "Posting..." : "Post Review"}
                            </button>
                        </div>
                    </form>
                </div>

                <h3>Reviews Received</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((r) => {
                        const reviewId = r._id || r.id;
                        const reviewerId = r.reviewerId?._id ?? r.reviewerId ?? r.reviewer;
                        const isAuthor = reviewerId === currentUserId;

                        return (
                            <div key={reviewId} className="review" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                                            <p style={{ margin: 0 }}><strong>Comment:</strong> {r.text || ""}</p>
                                            <p style={{ margin: 0, fontSize: "0.9em", color: "#666" }}>{new Date(r.createdAt).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginLeft: "12px" }}>
                                    {editingReviewId === reviewId ? (
                                        <>
                                            <button onClick={() => handleSaveEdit(reviewId)} style={{ padding: "6px 10px", marginRight: "6px" }}>Save</button>
                                            <button onClick={handleCancelEdit} style={{ padding: "6px 10px" }}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            {isAuthor ? (
                                                <>
                                                    <button onClick={() => handleEditClick(r)} style={{ padding: "6px 10px", marginRight: "6px" }}>Edit</button>
                                                    <button onClick={() => handleDelete(reviewId)} style={{ padding: "6px 10px", marginRight: "6px", backgroundColor: "#ff4444" }}>Delete</button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleReport(reviewId)} style={{ padding: "6px 10px", marginRight: "6px" }}>Report</button>
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


