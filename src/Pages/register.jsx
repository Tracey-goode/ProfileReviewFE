import {useState} from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    
    async function handleRegister(e) {
        e.preventDefault();
        setError("");
        
        try{
        const res = await axios.post("http://localhost:3000/api/auth/register",{
            email, password,
        });
        
        navigate("/home");
    } catch (err) {
        console.error("Registration Error", err);
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.respose.data.message);
        } else {
            setError("Registration failed. Try again");
        }
    }
}


    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister} style={{ display: "inline-block", textAlign: "left" }}>
                <label>Email:</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required /><br />

                <label>Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required /><br />

                <button type="submit" style={{ marginTop: "10px" }}>Register</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
            <div style={{ marginTop: "10px" }}>
                <button onClick={() => navigate("/")}>Back to Login</button>
            </div>
        </div>
    );
}

export default Register;
