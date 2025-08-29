import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddRacehorseModal from "../components/AddRacehorseModal";
import EditRacehorseModal from "../components/EditRacehorseModal";
import ConfirmModal from "../components/ConfirmModal";
import FilterModal from "../components/FilterModal";
import "./Racehorses.css";  // import the CSS

function Racehorses() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    breed: "",
    country: "",
    is_active: "",
  });
  const [search, setSearch] = useState("");

  const fetchPage = useCallback(
    (pageNum = 1) => {
      const params = new URLSearchParams({ page: pageNum });

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") {
          if (key === "is_active") {
            params.append(key, value);
          } else {
            params.append(`${key}__icontains`, value);
          }
        }
      });

      // Search
      if (search.trim() !== "") {
        params.append("search", search);
      }

      fetchWithAuth(`/racehorses/?${params.toString()}`)
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
    [filters, search, fetchWithAuth, logout]
  );

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

      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => fetchPage(1)}>Search</button>
        <button onClick={() => setShowFilterModal(true)}>⚙️ Filters</button>
      </div>

      {user && <button onClick={() => setShowModal(true)}>➕ Add Racehorse</button>}

      <ul>
        {items.map((horse) => (
          <li key={horse.id}>
            {horse.name}{" "}
            <Link to={`/racehorses/${horse.id}`}>
              <button>View Details</button>
            </Link>
            {user && <button onClick={() => setEditingHorse(horse)}>✏️ Edit</button>}
            {user && <button onClick={() => setConfirmDelete(horse)}>🗑️ Delete</button>}
          </li>
        ))}
      </ul>

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
        <AddRacehorseModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchPage(page)}
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

      {showFilterModal && (
        <FilterModal
          filters={filters}
          onChange={setFilters}
          onApply={() => {
            fetchPage(1);
            setShowFilterModal(false);
          }}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}

export default Racehorses;
