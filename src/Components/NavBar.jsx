import { Link } from "react-router-dom";

function NavBar() {
    return (
        <nav>
            <div className="header"> Review App </div>
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Login</Link>
        </nav>
    );
}

export default NavBar;