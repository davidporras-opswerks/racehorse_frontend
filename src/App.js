import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/users/Login";
import Register from "./pages/users/Register";
import Racehorses from "./pages/racehorses/Racehorses";
import RacehorseDetail from "./pages/racehorses/RacehorseDetail";
import Jockeys from "./pages/jockeys/Jockeys";
import Races from "./pages/races/Races";
import Participations from "./pages/participations/Participations";
import JockeyDetail from "./pages/jockeys/JockeyDetail";
import RaceDetail from "./pages/races/RaceDetail";
import ParticipationDetail from "./pages/participations/ParticipationDetail";
import UserProfile from "./pages/users/UserProfile";
import Users from "./pages/users/Users";

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
