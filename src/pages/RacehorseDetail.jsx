import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditRacehorseModal from "../components/EditRacehorseModal";
import ConfirmModal from "../components/ConfirmModal";
import AddParticipationModal from "../components/AddParticipationModal";
import "./RacehorseDetail.css";
import defaultHorse from "../assets/default-horse.webp";
import "../styles/DetailCommon.css";

function RacehorseDetail() {
  const { id } = useParams();
  const { fetchWithAuth, user } = useAuth();
  const [horse, setHorse] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAddParticipation, setShowAddParticipation] = useState(false);
  const navigate = useNavigate();

  const fetchHorse = useCallback(() => {
    fetchWithAuth(`/racehorses/${id}/`)
      .then((data) => setHorse(data))
      .catch((err) => console.error(err));
  }, [fetchWithAuth, id]);

  useEffect(() => {
    fetchHorse();
  }, [fetchHorse]);

  const handleDelete = () => {
    fetchWithAuth(`/racehorses/${id}/`, { method: "DELETE" })
      .then(() => navigate("/racehorses"))
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete");
      });
  };

  if (!horse) return <p>Loading...</p>;

  return (
    <div className="racehorse-page">
      <div className="detail-card">
        <h2 className="detail-title">{horse.name}</h2>
        <div className="entity-image">
          <img src={horse.image || defaultHorse} alt={horse.name} />
        </div>
        <div className="racehorse-info">
          <p><strong>Breed:</strong> {horse.breed}</p>
          <p><strong>Gender:</strong> {horse.gender}</p>
          <p><strong>Birth Date:</strong> {horse.birth_date}</p>
          <p><strong>Country:</strong> {horse.country}</p>

          <div className="detail-badges">
            <span className={`badge ${horse.is_active ? "active" : "inactive"}`}>
              {horse.is_active ? "Active" : "Inactive"}
            </span>
            <span className="badge races">Races: {horse.total_races}</span>
            <span className="badge wins">Wins: {horse.total_wins}</span>
            <span className={`badge winrate ${horse.win_rate >= 50 ? "high" : "low"}`}>
              Win Rate: {horse.win_rate}%
            </span>
            <span className="badge g1">G1 Wins: {horse.g1_wins}</span>
            <span className="badge age">Age: {horse.age}</span>
          </div>
        </div>

        {/* Participations Section */}
        <div className="participations-section">
          <h3>Race Participations</h3>
          {horse.participations && horse.participations.length > 0 ? (
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Jockey</th>
                  <th>Position</th>
                  <th>Finish Time</th>
                  <th>Margin</th>
                  <th>Odds</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {horse.participations.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.jockey}</td>
                    <td>{p.position}</td>
                    <td>{p.finish_time || "-"}</td>
                    <td>{p.margin || "-"}</td>
                    <td>{p.odds || "-"}</td>
                    <td>{p.result_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No participations recorded.</p>
          )}
        </div>



        <div className="racehorse-actions">
          <button className="btn back" onClick={() => navigate(-1)}>Back</button>
          {user && <button className="btn edit" onClick={() => setShowEdit(true)}>Edit</button>}
          {user && <button className="btn delete" onClick={() => setConfirmDelete(true)}>Delete</button>}
          {user && (
            <button className="btn add" onClick={() => setShowAddParticipation(true)}>
              Add Participation
            </button>
          )}
        </div>
      </div>

      {showEdit && (
        <EditRacehorseModal
          horse={horse}
          onClose={() => setShowEdit(false)}
          onSuccess={(updated) => {
            setHorse(updated);
            setShowEdit(false);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${horse.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {showAddParticipation && (
        <AddParticipationModal
          defaultRacehorseId={horse.id}
          onClose={() => setShowAddParticipation(false)}
          onSuccess={() => {
            fetchHorse(); // 🔄 re-fetch whole racehorse detail
            setShowAddParticipation(false);
          }}
        />
      )}
    </div>
  );
}

export default RacehorseDetail;
