import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/NavBar";
import backEnd from "../Components/backEndApi/BackEnd";
import "../Styles/Homepage.css";

function Home() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    async function getData() {
        try {
            const res = await backEnd.getUsers();
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

            <div className="home-container">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="user-card"
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

useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
        navigate("/");
    }
    getData();
}, []);

export default Home;
