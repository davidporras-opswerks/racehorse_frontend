import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddRaceModal from "../components/AddRaceModal";
import EditRaceModal from "../components/EditRaceModal";
import ConfirmModal from "../components/ConfirmModal";
import RaceFilterModal from "../components/RaceFilterModal";
import RaceOrderModal from "../components/RaceOrderModal";
import "./Racehorses.css"; // reuse same styling

function Races() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRace, setEditingRace] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [ordering, setOrdering] = useState("");

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
    date_after: "",
    date_before: "",
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
              if (["location"].includes(key)) {
                params.append(`${key}__icontains`, value);
              } else {
                params.append(key, value);
              }
          }
        }
      });

      if (search.trim() !== "") {
        params.append("search", search);
      }

      // Ordering
      if (ordering) {
        params.append("ordering", ordering);
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
    [filters, search, ordering, fetchWithAuth, logout]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleDelete = async (raceId) => {
    try {
      await fetchWithAuth(`/races/${raceId}/`, { method: "DELETE" });
      setConfirmDelete(null);

      // Check if current page will be empty after deletion
      const remainingItems = items.filter((r) => r.id !== raceId);
      if (remainingItems.length === 0 && page > 1) {
        fetchPage(page - 1); // go to previous page
      } else {
        fetchPage(page); // stay on current page
      }
    } catch (err) {
      console.error("Failed to delete race:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="racehorses-page">
      <h1 className="page-title">Races</h1>

      {/* Search + Filter */}
      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search by race name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => fetchPage(1)}>Search</button>
        <button onClick={() => setShowFilterModal(true)}>⚙️ Filters</button>
        <button onClick={() => setShowOrderModal(true)}>⇅ Sort</button>
      </div>

      {/* Add race */}
      {user && (
        <button className="add-button" onClick={() => setShowModal(true)}>
          Add Race
        </button>
      )}

      {/* Grid of race cards */}
      <div className="racehorse-grid">
        {items.map((race) => (
          <div key={race.id} className="racehorse-card">
            {/* Clickable area */}
            <Link
              to={`/races/${race.id}`}
              className="card-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="racehorse-info">
                <h3>{race.name}</h3>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(race.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Location:</strong> {race.location}
                </p>
                <p>
                  <strong>Classification:</strong> {race.classification} |{" "}
                  <strong>Surface:</strong> {race.track_surface}
                </p>
                <p>
                  <strong>Length:</strong> {race.track_length}m
                </p>
                <p>
                  <strong>Winner:</strong> {race.winner || "N/A"}
                </p>
                <p>
                  <strong>Participants:</strong> {race.total_participants}
                </p>
              </div>
            </Link>

            {/* Actions outside link */}
            {user && (
              <div className="card-actions">
                <button onClick={() => setEditingRace(race)}>Edit</button>
                <button onClick={() => setConfirmDelete(race)}>Delete</button>
              </div>
            )}
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
      {showOrderModal && (
        <RaceOrderModal
          ordering={ordering}
          onChange={setOrdering}
          onApply={() => {
            fetchPage(1); // reset to first page
            setShowOrderModal(false);
          }}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
}

export default Races;
