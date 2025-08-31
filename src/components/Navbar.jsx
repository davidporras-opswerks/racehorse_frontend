import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"; // 👈 import css
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="navbar-brand" to="/">
          🏇 Race App
        </Link>
      </div>
      <div className="navbar-right">
        <Link className="navbar-link" to="/racehorses">Racehorses</Link>
        <Link className="navbar-link" to="/jockeys">Jockeys</Link>
        <Link className="navbar-link" to="/races">Races</Link>
        <Link className="navbar-link" to="/participations">Participations</Link>
        <Link className="navbar-link" to="/users">Users</Link>
        {user ? (
          <>
            
            <Link className="navbar-link" to={`/users/${user.user_id}`}>{user.username}</Link>

            {/* 👇 Only visible if user.is_admin is true */}
            {user.is_admin && (
              <Link className="navbar-link" to="/register">Register</Link>
            )}

            <button className="navbar-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link className="navbar-link" to="/login">Login</Link>
        )}
        <ThemeToggle></ThemeToggle>
      </div>
    </nav>
  );
}

export default Navbar;
