import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditJockeyModal from "../components/EditJockeyModal";
import ConfirmModal from "../components/ConfirmModal";

function JockeyDetail() {
  const { id } = useParams();
  const { fetchWithAuth } = useAuth();
  const [jockey, setJockey] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithAuth(`/jockeys/${id}/`)
      .then((data) => setJockey(data))
      .catch((err) => {
        console.error(err);
      });
  }, [id, fetchWithAuth]);

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
    <div>
      <h2>{jockey.name}</h2>
      <p><strong>Height:</strong> {jockey.height_cm ? `${jockey.height_cm} cm` : "N/A"}</p>
      <p><strong>Weight:</strong> {jockey.weight_kg ? `${jockey.weight_kg} kg` : "N/A"}</p>
      <p><strong>Birth Date:</strong> {jockey.birth_date || "N/A"}</p>
      <p><strong>Total Races:</strong> {jockey.total_races}</p>
      <p><strong>Total Wins:</strong> {jockey.total_wins}</p>
      <p><strong>Win Rate:</strong> {jockey.win_rate}%</p>
      <p><strong>Age:</strong> {jockey.age || "N/A"}</p>

      {jockey.image && (
        <div>
          <img src={jockey.image} alt={jockey.name} style={{ maxWidth: "300px" }} />
        </div>
      )}

      <button onClick={() => navigate(-1)}>⬅ Back</button>
      <button onClick={() => setShowEdit(true)}>✏️ Edit</button>
      <button onClick={() => setConfirmDelete(true)}>🗑️ Delete</button>

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
    </div>
  );
}

export default JockeyDetail;
