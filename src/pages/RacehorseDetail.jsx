import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditRacehorseModal from "../components/EditRacehorseModal";
import ConfirmModal from "../components/ConfirmModal";

function RacehorseDetail() {
  const { id } = useParams();
  const { fetchWithAuth, user } = useAuth();
  const [horse, setHorse] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithAuth(`/racehorses/${id}/`)
      .then((data) => setHorse(data))
      .catch((err) => {
        console.error(err);
      });
  }, [id, fetchWithAuth]);

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
    <div>
      <h2>{horse.name}</h2>
      <p><strong>Breed:</strong> {horse.breed}</p>
      <p><strong>Gender:</strong> {horse.gender}</p>
      <p><strong>Birth Date:</strong> {horse.birth_date}</p>
      <p><strong>Country:</strong> {horse.country}</p>
      <p><strong>Active:</strong> {horse.is_active ? "Yes" : "No"}</p>
      <p><strong>Total Races:</strong> {horse.total_races}</p>
      <p><strong>Total Wins:</strong> {horse.total_wins}</p>
      <p><strong>Win Rate:</strong> {horse.win_rate}%</p>
      <p><strong>Age:</strong> {horse.age}</p>

      {horse.image && (
        <div>
          <img src={horse.image} alt={horse.name} style={{ maxWidth: "300px" }} />
        </div>
      )}

      <button onClick={() => navigate(-1)}>⬅ Back</button>
      {user && <button onClick={() => setShowEdit(true)}>✏️ Edit</button>}
      {user && <button onClick={() => setConfirmDelete(true)}>🗑️ Delete</button>}
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
    </div>
  );
}

export default RacehorseDetail;
