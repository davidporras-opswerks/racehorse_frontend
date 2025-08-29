import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddParticipationModal from "../components/AddParticipationModal";
import EditParticipationModal from "../components/EditParticipationModal";
import ConfirmModal from "../components/ConfirmModal";

function Participations() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingParticipation, setEditingParticipation] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const pageSize = 10; // backend default unless overridden

  const fetchPage = useCallback(
    (pageNum) => {
      fetchWithAuth(`/participations/?page=${pageNum}`)
        .then((data) => {
          setItems(data.results || []);
          setCount(data.count || 0);
          setNext(data.next);
          setPrevious(data.previous);
          setPage(pageNum);
        })
        .catch((err) => {
          console.error(err);
          logout();
        });
    },
    [fetchWithAuth, logout]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleDelete = (id) => {
    fetchWithAuth(`/participations/${id}/`, { method: "DELETE" })
      .then(() => {
        setItems(items.filter((p) => p.id !== id));
        setConfirmDelete(null);
      })
      .catch((err) => {
        console.error("Failed to delete participation:", err);
        alert("Delete failed");
      });
  };

  return (
    <div>
      <h1>Participations</h1>
      {user && (
        <button onClick={() => setShowModal(true)}>➕ Add Participation</button>
      )}
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <strong>{p.racehorse_name}</strong> in <em>{p.race_name}</em> 🏆  
            — ridden by {p.jockey_name}, Position: {p.position} ({p.result_status})
            <Link to={`/participations/${p.id}`}>
              <button>View Details</button>
            </Link>
            {user && <button onClick={() => setEditingParticipation(p)}>✏️ Edit</button>}
            {user && <button onClick={() => setConfirmDelete(p)}>🗑️ Delete</button>}
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div style={{ marginTop: "1rem" }}>
        <button disabled={!previous} onClick={() => fetchPage(page - 1)}>
          ⬅️ Previous
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {Math.ceil(count / pageSize)}
        </span>
        <button disabled={!next} onClick={() => fetchPage(page + 1)}>
          Next ➡️
        </button>
      </div>

      {showModal && (
        <AddParticipationModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchPage(page);
            setShowModal(false);
          }}
        />
      )}
      {editingParticipation && (
        <EditParticipationModal
          participation={editingParticipation}
          onClose={() => setEditingParticipation(null)}
          onSuccess={(updated) => {
            setItems(items.map((p) => (p.id === updated.id ? updated : p)));
            setEditingParticipation(null);
          }}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete participation of "${confirmDelete.racehorse_name}" in "${confirmDelete.race_name}"?`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

export default Participations;
