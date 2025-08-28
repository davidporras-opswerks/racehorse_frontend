import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddJockeyModal from "../components/AddJockeyModal";
import EditJockeyModal from "../components/EditJockeyModal";
import ConfirmModal from "../components/ConfirmModal";

function Jockeys() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJockey, setEditingJockey] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const pageSize = 10; // Django default unless overridden

  const fetchPage = useCallback((pageNum) => {
      fetchWithAuth(`/jockeys/?page=${pageNum}`)
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

  const handleDelete = (jockeyId) => {
    fetchWithAuth(`/jockeys/${jockeyId}/`, { method: "DELETE" })
      .then(() => {
        setItems(items.filter((j) => j.id !== jockeyId));
        setConfirmDelete(null);
      })
      .catch((err) => {
        console.error("Failed to delete racehorse:", err);
        alert("Delete failed");
      });
  };

  return (
    <div>
      <h1>Jockeys</h1>
      {user && (
        <button onClick={() => setShowModal(true)}>➕ Add Racehorse</button>
      )}
      <ul>
        {items.map((jockey) => (
          <li key={jockey.id}>{jockey.name}{" "}
            <Link to={`/jockeys/${jockey.id}`}>
              <button>View Details</button>
            </Link>
            <button onClick={() => setEditingJockey(jockey)}>✏️ Edit</button>
            <button onClick={() => setConfirmDelete(jockey)}>🗑️ Delete</button>
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
        <AddJockeyModal
          onClose={() => setShowModal(false)}
          onSuccess={(newHorse) => {
            // Refetch current page to keep pagination consistent
            fetchPage(page);
            setShowModal(false);
          }}
        />
      )}
      {editingJockey && (
        <EditJockeyModal
          jockey={editingJockey}
          onClose={() => setEditingJockey(null)}
          onSuccess={(updated) => {
            setItems(items.map((h) => (h.id === updated.id ? updated : h)));
            setEditingJockey(null);
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

export default Jockeys;
