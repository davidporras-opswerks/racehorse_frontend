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
import ParticipationDetail from "./pages/ParticipationDetail";
import UserProfile from "./pages/UserProfile";
import Users from "./pages/Users";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar /> {/* 👈 navbar is always visible */}

      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/racehorses" />} />
        <Route path="/" element={<Navigate to="/racehorses" />} />
        <Route path="/racehorses" element={<Racehorses />} />
        <Route path="/racehorses/:id" element={<RacehorseDetail />} />
        <Route path="/jockeys" element={<Jockeys />} />
        <Route path="/jockeys/:id" element={<JockeyDetail />} />
        <Route path="/races" element={<Races />} />
        <Route path="/races/:id" element={<RaceDetail />} />
        <Route path="/participations" element={<Participations />} />
        <Route path="/participations/:id" element={<ParticipationDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
