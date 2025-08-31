import { useTheme } from "../context/ThemeProvider";
import "./ThemeToggle.css"; // we'll put the styles here

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`toggle-wrapper ${isLight ? "light" : "dark"}`}
      onClick={() => setTheme(isLight ? "dark" : "light")}
    >
      <div className="toggle-circle">{isLight ? "☀️" : "🌙"}</div>
    </div>
  );
}

export default ThemeToggle;