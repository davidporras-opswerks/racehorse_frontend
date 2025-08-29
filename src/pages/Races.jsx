import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddRaceModal from "../components/AddRaceModal";
import EditRaceModal from "../components/EditRaceModal";
import ConfirmModal from "../components/ConfirmModal";
import RaceFilterModal from "../components/RaceFilterModal";
import "./Racehorses.css"; // reuse same CSS

function Races() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRace, setEditingRace] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    location: "",
    track_surface: "",
    classification: "",
    season: "",
    date_after: "", // for date__gt
    date_before: "", // for date__lt
  });

  const [search, setSearch] = useState("");

  const fetchPage = useCallback(
    (pageNum = 1) => {
      const params = new URLSearchParams({ page: pageNum });

      // Filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") {
          switch (key) {
            case "date_after":
              params.append("date__gt", value);
              break;
            case "date_before":
              params.append("date__lt", value);
              break;
            default:
              // partial match for text fields, exact for others
              if (["location"].includes(key)) {
                params.append(`${key}__icontains`, value);
              } else {
                params.append(key, value);
              }
          }
        }
      });

      // Search by name
      if (search.trim() !== "") {
        params.append("search", search);
      }

      fetchWithAuth(`/races/?${params.toString()}`)
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

      {user && <button onClick={() => setShowModal(true)}>➕ Add Race</button>}

      <ul>
        {items.map((race) => (
          <li key={race.id}>
            {race.name}{" "}
            <Link to={`/races/${race.id}`}>
              <button>View Details</button>
            </Link>
            {user && <button onClick={() => setEditingRace(race)}>✏️ Edit</button>}
            {user && <button onClick={() => setConfirmDelete(race)}>🗑️ Delete</button>}
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
        <AddRaceModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchPage(page)}
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

      {showFilterModal && (
        <RaceFilterModal
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

export default Races;
