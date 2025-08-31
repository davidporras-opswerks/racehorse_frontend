import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
import ThemeToggle from "./ThemeToggle";
import horseshoeLight from "../assets/horseshoe-light.png";
import horseshoeDark from "../assets/horseshoe-dark.png";
import { useTheme } from "../context/ThemeProvider";
import defaultAvatar from "../assets/default-avatar.webp"; // fallback avatar

function Navbar() {
  const { user, logout: logoutOriginal } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const logout = () => {
    logoutOriginal();
    navigate("/racehorses"); // redirect after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="navbar-brand" to="/">
          <img
            src={theme === "dark" ? horseshoeDark : horseshoeLight}
            alt="Uma Records"
            className="navbar-logo"
          />
          Uma Records
        </Link>
      </div>
      <div className="navbar-right">
        <Link className="navbar-link" to="/racehorses">Racehorses</Link>
        <Link className="navbar-link" to="/jockeys">Jockeys</Link>
        <Link className="navbar-link" to="/races">Races</Link>
        <Link className="navbar-link" to="/participations">Participations</Link>
        <Link className="navbar-link" to="/users">Users</Link>
        {user && user.is_admin && (
          <Link className="navbar-link" to="/register">Register</Link>
        )}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User avatar */}
        {user && (
          <Link to={`/users/${user.user_id}`} className="navbar-avatar-link">
            <img
              src={user.avatar || defaultAvatar} 
              alt="User Avatar"
              className="navbar-avatar"
            />
          </Link>
        )}

        {/* Optional logout button */}
        {user && (
          <button className="navbar-button logout" onClick={logout}>
            Logout
          </button>
        )}

        {!user && <Link className="navbar-link" to="/login">Login</Link>}
      </div>
    </nav>
  );
}

export default Navbar;
