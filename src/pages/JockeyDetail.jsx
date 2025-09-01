import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditJockeyModal from "../components/EditJockeyModal";
import ConfirmModal from "../components/ConfirmModal";
import AddParticipationModal from "../components/AddParticipationModal";
import "./JockeyDetail.css";
import defaultJockey from "../assets/default-jockey.webp";
import "../styles/DetailCommon.css";

function JockeyDetail() {
  const { id } = useParams();
  const { fetchWithAuth, user } = useAuth();
  const [jockey, setJockey] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAddParticipation, setShowAddParticipation] = useState(false);
  const navigate = useNavigate();

  const fetchJockey = useCallback(() => {
    fetchWithAuth(`/jockeys/${id}/`)
      .then((data) => setJockey(data))
      .catch((err) => console.error(err));
  }, [fetchWithAuth, id]);

  useEffect(() => {
    fetchJockey();
  }, [fetchJockey]);

  const handleDelete = () => {
    fetchWithAuth(`/jockeys/${id}/`, { method: "DELETE" })
      .then(() => navigate("/jockeys"))
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete");
      });
  };

  if (!jockey) return <p>Loading...</p>;

  return (
    <div className="jockey-page">
      <div className="detail-card">
        <h2 className="detail-title">{jockey.name}</h2>

        <div className="entity-image">
          <img src={jockey.image || defaultJockey} alt={jockey.name} />
        </div>

        <div className="jockey-info">
          <p><strong>Height:</strong> {jockey.height_cm ? `${jockey.height_cm} cm` : "N/A"}</p>
          <p><strong>Weight:</strong> {jockey.weight_kg ? `${jockey.weight_kg} kg` : "N/A"}</p>
          <p><strong>Birth Date:</strong> {jockey.birth_date || "N/A"}</p>

          <div className="detail-badges">
            <span className="badge races">Races: {jockey.total_races}</span>
            <span className="badge wins">Wins: {jockey.total_wins}</span>
            <span className={`badge winrate ${jockey.win_rate >= 50 ? "high" : "low"}`}>
              Win Rate: {jockey.win_rate}%
            </span>
            <span className="badge g1">G1 Wins: {jockey.g1_wins}</span>
            {jockey.age && <span className="badge age">Age: {jockey.age}</span>}
          </div>
        </div>

        {/* Racehorses Section */}
        <div className="racehorses-section">
          <h3>Racehorses Ridden</h3>
          {jockey.racehorses && jockey.racehorses.length > 0 ? (
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Races with Jockey</th>
                  <th>Wins with Jockey</th>
                  <th>Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {jockey.racehorses.map((rh, idx) => (
                  <tr key={idx}>
                    <td>{rh.name}</td>
                    <td>{rh.jockey_total_races}</td>
                    <td>{rh.jockey_total_wins}</td>
                    <td>{rh.jockey_win_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No racehorses recorded.</p>
          )}
        </div>



        {/* Participations Section */}
        <div className="participations-section">
          <h3>Race Participations</h3>
          {jockey.participations && jockey.participations.length > 0 ? (
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Racehorse</th>
                  <th>Position</th>
                  <th>Finish Time</th>
                  <th>Margin</th>
                  <th>Odds</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {jockey.participations.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.racehorse}</td>
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

        <div className="jockey-actions">
          <button className="btn back" onClick={() => navigate(-1)}>⬅ Back</button>
          {user && <button className="btn edit" onClick={() => setShowEdit(true)}>✏️ Edit</button>}
          {user && <button className="btn delete" onClick={() => setConfirmDelete(true)}>🗑️ Delete</button>}
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
        <EditJockeyModal
          jockey={jockey}
          onClose={() => setShowEdit(false)}
          onSuccess={(updated) => {
            setJockey(updated);
            setShowEdit(false);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${jockey.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {showAddParticipation && (
        <AddParticipationModal
          defaultJockeyId={jockey.id} // <-- pre-select this jockey
          onClose={() => setShowAddParticipation(false)}
          onSuccess={(newParticipation) => {
            fetchJockey(); // 🔄 re-fetch whole racehorse detail
            setShowAddParticipation(false);
          }}
        />
      )}
    </div>
  );
}

export default JockeyDetail;
