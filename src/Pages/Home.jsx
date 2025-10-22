import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import backEnd from "../apiService";

function Home() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    async function getData() {
        try {
            const res = await apiService.getUsers();
            setUsers(shuffle(res.data));
        } catch (err) {
            console.error("Error fetching users:", err.message);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <Navbar onReload={getData} />
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px"
            }}>
                {users.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            border: "1px solid gray",
                            borderRadius: "8px",
                            padding: "10px",
                            width: "180px",
                            cursor: "pointer",
                            background: "#fafafa"
                        }}
                        onClick={() => navigate(`/user/${user.id}`)}
                    >
                        <h4>User #{user.id}</h4>
                        <p>{user.bio || "No bio available"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
