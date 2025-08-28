import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddRaceModal from "../components/AddRaceModal";
import EditRaceModal from "../components/EditRaceModal";
import ConfirmModal from "../components/ConfirmModal";

function Races() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRace, setEditingRace] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const pageSize = 10; // Django REST default unless overridden

  const fetchPage = useCallback(
    (pageNum) => {
      fetchWithAuth(`/races/?page=${pageNum}`)
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

  const handleDelete = (raceId) => {
    fetchWithAuth(`/races/${raceId}/`, { method: "DELETE" })
      .then(() => {
        setItems(items.filter((r) => r.id !== raceId));
        setConfirmDelete(null);
      })
      .catch((err) => {
        console.error("Failed to delete race:", err);
        alert("Delete failed");
      });
  };

  return (
    <div>
      <h1>Races</h1>
      {user && (
        <button onClick={() => setShowModal(true)}>➕ Add Race</button>
      )}
      <ul>
        {items.map((race) => (
          <li key={race.id}>
            {race.name}{" "}
            <Link to={`/races/${race.id}`}>
              <button>View Details</button>
            </Link>
            <button onClick={() => setEditingRace(race)}>✏️ Edit</button>
            <button onClick={() => setConfirmDelete(race)}>🗑️ Delete</button>
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
        <AddRaceModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            // Refetch to keep pagination consistent
            fetchPage(page);
            setShowModal(false);
          }}
        />
      )}
      {editingRace && (
        <EditRaceModal
          race={editingRace}
          onClose={() => setEditingRace(null)}
          onSuccess={(updated) => {
            setItems(items.map((r) => (r.id === updated.id ? updated : r)));
            setEditingRace(null);
          }}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirmDelete.name}"?`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

export default Races;
