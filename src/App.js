import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Racehorses from "./pages/Racehorses";
import Jockeys from "./pages/Jockeys";
import Races from "./pages/Races";
import Participations from "./pages/Participations";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar /> {/* 👈 navbar is always visible */}

      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/racehorses" />} />
        <Route path="/racehorses" element={user ? <Racehorses /> : <Navigate to="/login" />} />
        <Route path="/jockeys" element={user ? <Jockeys /> : <Navigate to="/login" />} />
        <Route path="/races" element={user ? <Races /> : <Navigate to="/login" />} />
        <Route path="/participations" element={user ? <Participations /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
