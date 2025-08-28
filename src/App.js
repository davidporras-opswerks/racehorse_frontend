import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Racehorses from "./pages/Racehorses";
import RacehorseDetail from "./pages/RacehorseDetail";
import Jockeys from "./pages/Jockeys";
import Races from "./pages/Races";
import Participations from "./pages/Participations";
import JockeyDetail from "./pages/JockeyDetail";
import RaceDetail from "./pages/RaceDetail";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar /> {/* 👈 navbar is always visible */}

      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/racehorses" />} />
        <Route path="/racehorses" element={user ? <Racehorses /> : <Navigate to="/login" />} />
        <Route path="/racehorses/:id" element={<RacehorseDetail />} />
        <Route path="/jockeys" element={user ? <Jockeys /> : <Navigate to="/login" />} />
        <Route path="/jockeys/:id" element={<JockeyDetail />} />
        <Route path="/races" element={user ? <Races /> : <Navigate to="/login" />} />
        <Route path="/races/:id" element={<RaceDetail />} />
        <Route path="/participations" element={user ? <Participations /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
