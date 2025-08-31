import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddJockeyModal from "../components/AddJockeyModal";
import EditJockeyModal from "../components/EditJockeyModal";
import ConfirmModal from "../components/ConfirmModal";
import "./Racehorses.css"; // reuse same styling
import defaultJockey from "../assets/default-jockey.webp";

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

  const handleDelete = async (jockeyId) => {
    try {
      await fetchWithAuth(`/jockeys/${jockeyId}/`, { method: "DELETE" });
      setConfirmDelete(null);

      // Check if current page will be empty after deletion
      const remainingItems = items.filter((j) => j.id !== jockeyId);
      if (remainingItems.length === 0 && page > 1) {
        fetchPage(page - 1); // go to previous page
      } else {
        fetchPage(page); // stay on current page
      }
    } catch (err) {
      console.error("Failed to delete jockey:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="racehorses-page">
      <h1 className="page-title">Jockeys</h1>

      {/* Search bar */}
      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => fetchPage(1)}>Search</button>
      </div>

      {/* Add button */}
      {user && (
        <button
          className="add-button"
          onClick={() => setShowModal(true)}
        >
          Add Jockey
        </button>
      )}

      {/* Grid of cards */}
      <div className="racehorse-grid">
        {items.map((jockey) => (
          <div key={jockey.id} className="racehorse-card">
            <img
              src={jockey.image || defaultJockey}
              alt={jockey.name}
              className="racehorse-image"
            />
            <div className="racehorse-info">
              <h3>{jockey.name}</h3>
              <p><strong>Races:</strong> {jockey.total_races}</p>
              <p><strong>Wins:</strong> {jockey.total_wins}</p>
              <p><strong>Win Rate:</strong> {jockey.win_rate}%</p>

              <div className="card-actions">
                <Link to={`/jockeys/${jockey.id}`}>
                  <button>View</button>
                </Link>
                {user && (
                  <>
                    <button onClick={() => setEditingJockey(jockey)}>Edit</button>
                    <button onClick={() => setConfirmDelete(jockey)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={!previous} onClick={() => fetchPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(count / pageSize)}
        </span>
        <button disabled={!next} onClick={() => fetchPage(page + 1)}>
          Next
        </button>
      </div>

      {/* Modals */}
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
            fetchPage(page);
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
