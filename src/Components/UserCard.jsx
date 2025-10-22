import React, { useState, useEffect } from "react";

function ReviewForm({ onAddReview }) {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const review = { rating, text };

        // Send to backend
        fetch("http://localhost:3000/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(review),
        })
            .then((res) => res.json())
            .then((data) => {
                onAddReview(data);
                setText("");
                setRating(5);
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Leave a Review</h3>
            <label>Rating:</label><br />
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select><br /><br />

            <label>Review:</label><br />
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="3"
                cols="30"
                placeholder="Write your review..."
            ></textarea><br /><br />

            <button type="submit">Submit Review</button>
        </form>
    );
}

function Profile() {
    const [bio, setBio] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [reviews, setReviews] = useState([]);

    // Fetch user info when app loads
    useEffect(() => {
        fetch("http://localhost:3000/api/user")
            .then((res) => res.json())
            .then((data) => {
                setBio(data.bio);
                setHeight(data.height);
                setWeight(data.weight);
            });

        fetch("http://localhost:3000/api/reviews")
            .then((res) => res.json())
            .then((data) => setReviews(data));
    }, []);

    function handleSave() {
        const updatedUser = { bio, height, weight, id: 1 };

        fetch("http://localhost:3000/api/user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser),
        })
            .then((res) => res.json())
            .then(() => setIsEditing(false));
    }

    function handleAddReview(newReview) {
        setReviews([...reviews, newReview]);
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>User Profile</h2>

            {!isEditing && (
                <div
                    style={{
                        border: "1px solid gray",
                        borderRadius: "5px",
                        padding: "10px",
                        width: "300px",
                        backgroundColor: "#f9f9f9",
                        marginBottom: "15px",
                    }}
                >
                    <p><strong>Bio:</strong> {bio}</p>
                    <p><strong>Height:</strong> {height} cm</p>
                    <p><strong>Weight:</strong> {weight} kg</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}

            {isEditing && (
                <div style={{ marginBottom: "20px" }}>
                    <h3>Edit Profile</h3>
                    <label>Bio:</label><br />
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} /><br />
                    <label>Height (cm):</label><br />
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    /><br />
                    <label>Weight (kg):</label><br />
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    /><br /><br />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)} style={{ marginLeft: "5px" }}>
                        Cancel
                    </button>
                </div>
            )}

            <ReviewForm onAddReview={handleAddReview} />

            <div style={{ marginTop: "20px" }}>
                <h3>Reviews:</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    <ul>
                        {reviews.map((r) => (
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

export default Profile;
