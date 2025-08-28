import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddRacehorseModal from "../components/AddRacehorseModal";
import EditRacehorseModal from "../components/EditRacehorseModal";
import ConfirmModal from "../components/ConfirmModal";

function Racehorses() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const pageSize = 10; // Django default unless overridden

  const fetchPage = useCallback((pageNum) => {
    fetchWithAuth(`/racehorses/?page=${pageNum}`)
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
  }, [fetchWithAuth, logout]);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleDelete = (horseId) => {
    fetchWithAuth(`/racehorses/${horseId}/`, { method: "DELETE" })
      .then(() => {
        setItems(items.filter((h) => h.id !== horseId));
        setConfirmDelete(null);
      })
      .catch((err) => {
        console.error("Failed to delete racehorse:", err);
        alert("Delete failed");
      });
  };

  return (
    <div>
      <h1>Racehorses</h1>
      {user && (
        <button onClick={() => setShowModal(true)}>➕ Add Racehorse</button>
      )}

      <ul>
        {items.map((horse) => (
          <li key={horse.id}>
            {horse.name}{" "}
            <Link to={`/racehorses/${horse.id}`}>
              <button>View Details</button>
            </Link>
            <button onClick={() => setEditingHorse(horse)}>✏️ Edit</button>
            <button onClick={() => setConfirmDelete(horse)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div style={{ marginTop: "1rem" }}>
        <button
          disabled={!previous}
          onClick={() => fetchPage(page - 1)}
        >
          ⬅️ Previous
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {Math.ceil(count / pageSize)}
        </span>
        <button
          disabled={!next}
          onClick={() => fetchPage(page + 1)}
        >
          Next ➡️
        </button>
      </div>

      {showModal && (
        <AddRacehorseModal
          onClose={() => setShowModal(false)}
          onSuccess={(newHorse) => {
            // Refetch current page to keep pagination consistent
            fetchPage(page);
            setShowModal(false);
          }}
        />
      )}

      {editingHorse && (
        <EditRacehorseModal
          horse={editingHorse}
          onClose={() => setEditingHorse(null)}
          onSuccess={(updated) => {
            setItems(items.map((h) => (h.id === updated.id ? updated : h)));
            setEditingHorse(null);
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

export default Racehorses;
