import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddJockeyModal from "../components/AddJockeyModal";
import EditJockeyModal from "../components/EditJockeyModal";
import ConfirmModal from "../components/ConfirmModal";
import "./Racehorses.css"; // reuse the same CSS for buttons, pagination, etc.

function Jockeys() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJockey, setEditingJockey] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const pageSize = 10;

  const [search, setSearch] = useState("");

  const fetchPage = useCallback(
    (pageNum = 1) => {
      const params = new URLSearchParams({ page: pageNum });

      // Search (matches JockeyFilter & SearchFilter)
      if (search.trim() !== "") {
        params.append("search", search);
      }

      fetchWithAuth(`/jockeys/?${params.toString()}`)
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
    [search, fetchWithAuth, logout]
  );

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
        console.error("Failed to delete jockey:", err);
        alert("Delete failed");
      });
  };

  return (
    <div>
      <h1>Jockeys</h1>

      {/* Search input */}
      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => fetchPage(1)}>Search</button>
      </div>

      {user && <button onClick={() => setShowModal(true)}>➕ Add Jockey</button>}

      <ul>
        {items.map((jockey) => (
          <li key={jockey.id}>
            {jockey.name}{" "}
            <Link to={`/jockeys/${jockey.id}`}>
              <button>View Details</button>
            </Link>
            {user && <button onClick={() => setEditingJockey(jockey)}>✏️ Edit</button>}
            {user && <button onClick={() => setConfirmDelete(jockey)}>🗑️ Delete</button>}
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
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
        <AddJockeyModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchPage(page)}
        />
      )}

      {editingJockey && (
        <EditJockeyModal
          jockey={editingJockey}
          onClose={() => setEditingJockey(null)}
          onSuccess={(updated) => {
            setItems(items.map((j) => (j.id === updated.id ? updated : j)));
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
