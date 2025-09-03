import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EditRaceModal from "../../components/EditRaceModal";
import ConfirmModal from "../../components/ConfirmModal";
import AddParticipationModal from "../../components/AddParticipationModal";
import "../../styles/DetailCommon.css";
import "../styles/RaceDetail.css"

function RaceDetail() {
  const { id } = useParams();
  const { fetchWithAuth, user } = useAuth();
  const [race, setRace] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAddParticipation, setShowAddParticipation] = useState(false);
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

  const fetchRace = useCallback(() => {
    fetchWithAuth(`/races/${id}/`)
      .then((data) => setRace(data))
      .catch((err) => console.error(err));
  }, [fetchWithAuth, id]);

  useEffect(() => {
    fetchRace();
  }, [fetchRace]);

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
    <div className="race-page">
      <div className="detail-card">
        <h2 className="detail-title">{race.name}</h2>

        <div className="race-info">
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
        </div>

        {/* Participants Section */}
        <div className="participations-section">
          <h3>Participants</h3>
          {race.participations && race.participations.length > 0 ? (
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Racehorse</th>
                  <th>Jockey</th>
                  <th>Position</th>
                  <th>Finish Time</th>
                  <th>Margin</th>
                  <th>Odds</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {race.participations.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.racehorse}</td>
                    <td>{p.jockey}</td>
                    <td>{p.position}</td>
                    <td>{p.finish_time || "-"}</td>
                    <td>{p.margin || "-"}</td>
                    <td>{p.odds || "-"}</td>
                    <td className={`status ${p.result_status?.toLowerCase().replace(/\s+/g, "-")}`}>
                      {p.result_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No participants recorded.</p>
          )}
        </div>

        {/* Actions */}
        <div className="race-actions">
          <button className="btn back" onClick={() => navigate(-1)}>Back</button>
          {user && <button className="btn edit" onClick={() => setShowEdit(true)}>Edit</button>}
          {user && <button className="btn delete" onClick={() => setConfirmDelete(true)}>Delete</button>}
          {user && (
            <button
              className="btn add"
              onClick={() => setShowAddParticipation(true)}
            >
              Add Participation
            </button>
          )}
        </div>
      </div>

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
      {showAddParticipation && (
        <AddParticipationModal
          defaultRaceId={race.id} // <-- pre-select this race
          onClose={() => setShowAddParticipation(false)}
          onSuccess={(newParticipation) => {
            fetchRace();
            setShowAddParticipation(false);
          }}
        />
      )}
    </div>
  );
}

export default RaceDetail;
