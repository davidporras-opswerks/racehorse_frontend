import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditParticipationModal from "../components/EditParticipationModal";
import ConfirmModal from "../components/ConfirmModal";

function ParticipationDetail() {
  const { id } = useParams();
  const { fetchWithAuth } = useAuth();
  const [participation, setParticipation] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithAuth(`/participations/${id}/`)
      .then((data) => setParticipation(data))
      .catch((err) => {
        console.error(err);
      });
  }, [id, fetchWithAuth]);

  const handleDelete = () => {
    fetchWithAuth(`/participations/${id}/`, { method: "DELETE" })
      .then(() => navigate("/participations"))
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete participation");
      });
  };

  if (!participation) return <p>Loading...</p>;

  return (
    <div>
      <h2>Participation Details</h2>
      <p><strong>Racehorse:</strong> {participation.racehorse_name}</p>
      <p><strong>Race:</strong> {participation.race_name}</p>
      <p><strong>Jockey:</strong> {participation.jockey_name}</p>
      <p><strong>Position:</strong> {participation.position}</p>
      <p><strong>Status:</strong> {participation.result_status}</p>
      <p><strong>Winner:</strong> {participation.is_winner ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Finish Time:</strong> {participation.finish_time || "N/A"}</p>
      <p><strong>Margin:</strong> {participation.margin || "N/A"}</p>
      <p><strong>Odds:</strong> {participation.odds || "N/A"}</p>

      <button onClick={() => navigate(-1)}>⬅ Back</button>
      <button onClick={() => setShowEdit(true)}>✏️ Edit</button>
      <button onClick={() => setConfirmDelete(true)}>🗑️ Delete</button>

      {showEdit && (
        <EditParticipationModal
          participation={participation}
          onClose={() => setShowEdit(false)}
          onSuccess={(updated) => {
            setParticipation(updated);
            setShowEdit(false);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete participation of "${participation.racehorse_name}" in "${participation.race_name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

export default ParticipationDetail;
