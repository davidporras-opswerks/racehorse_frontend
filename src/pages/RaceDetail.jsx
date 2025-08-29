import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditRaceModal from "../components/EditRaceModal";
import ConfirmModal from "../components/ConfirmModal";

function RaceDetail() {
  const { id } = useParams();
  const { fetchWithAuth, user } = useAuth();
  const [race, setRace] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  // lookup maps for human-readable labels
  const TRACK_SURFACES = { D: "Dirt", T: "Turf", S: "Synthetic", O: "Other" };
  const CONFIGURATIONS = {
    left_handed: "Left Handed",
    right_handed: "Right Handed",
    straight: "Straight",
  };
  const CONDITIONS = {
    fast: "Fast",
    frozen: "Frozen",
    good: "Good",
    heavy: "Heavy",
    muddy: "Muddy",
    sloppy: "Sloppy",
    slow: "Slow",
    wet_fast: "Wet Fast",
    firm: "Firm",
    hard: "Hard",
    soft: "Soft",
    yielding: "Yielding",
    standard: "Standard",
    harsh: "Harsh",
  };
  const CLASSIFICATIONS = {
    G1: "Grade 1",
    G2: "Grade 2",
    G3: "Grade 3",
    L: "Listed",
    H: "Handicap",
    M: "Maiden",
    O: "Other",
  };
  const SEASONS = { SP: "Spring", SU: "Summer", FA: "Fall", WI: "Winter" };

  useEffect(() => {
    fetchWithAuth(`/races/${id}/`)
      .then((data) => setRace(data))
      .catch((err) => {
        console.error(err);
      });
  }, [id, fetchWithAuth]);

  const handleDelete = () => {
    fetchWithAuth(`/races/${id}/`, { method: "DELETE" })
      .then(() => navigate("/races"))
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete race");
      });
  };

  if (!race) return <p>Loading...</p>;

  return (
    <div>
      <h2>{race.name}</h2>
      <p><strong>Date:</strong> {race.date}</p>
      <p><strong>Location:</strong> {race.location}</p>
      <p><strong>Track Configuration:</strong> {CONFIGURATIONS[race.track_configuration] || race.track_configuration}</p>
      <p><strong>Track Surface:</strong> {TRACK_SURFACES[race.track_surface] || race.track_surface}</p>
      <p><strong>Track Condition:</strong> {CONDITIONS[race.track_condition] || race.track_condition}</p>
      <p><strong>Classification:</strong> {CLASSIFICATIONS[race.classification] || race.classification}</p>
      <p><strong>Season:</strong> {SEASONS[race.season] || race.season}</p>
      <p><strong>Track Length:</strong> {race.track_length} m</p>
      <p><strong>Prize Money:</strong> {race.prize_money} {race.currency}</p>
      <p><strong>Winner:</strong> {race.winner || "N/A"}</p>
      <p><strong>Total Participants:</strong> {race.total_participants}</p>

      {race.participations && race.participations.length > 0 && (
        <div>
          <h3>Participants</h3>
          <ul>
            {race.participations.map((p, idx) => (
              <li key={idx}>
                🐎 {p.racehorse} ridden by {p.jockey} — 
                Position: {p.position}, Status: {p.result_status}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => navigate(-1)}>⬅ Back</button>
      {user && <button onClick={() => setShowEdit(true)}>✏️ Edit</button>}
      {user && <button onClick={() => setConfirmDelete(true)}>🗑️ Delete</button>}

      {showEdit && (
        <EditRaceModal
          race={race}
          onClose={() => setShowEdit(false)}
          onSuccess={(updated) => {
            setRace(updated);
            setShowEdit(false);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete the race "${race.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

export default RaceDetail;
