import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddRacehorseModal from "../components/AddRacehorseModal";
import EditRacehorseModal from "../components/EditRacehorseModal";
import ConfirmModal from "../components/ConfirmModal";
import FilterModal from "../components/FilterModal";
import OrderModal from "../components/OrderModal";
import "./Racehorses.css";
import defaultHorse from "../assets/default-horse.webp";

function Racehorses() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState(null);
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

      // Ordering
      if (ordering) {
        params.append("ordering", ordering);
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
    [filters, search, ordering, fetchWithAuth, logout]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleDelete = async (horseId) => {
    try {
      await fetchWithAuth(`/racehorses/${horseId}/`, { method: "DELETE" });
      setConfirmDelete(null);

      // After deletion, check if the current page will be empty
      const remainingItems = items.filter((h) => h.id !== horseId);
      if (remainingItems.length === 0 && page > 1) {
        fetchPage(page - 1); // go to previous page
      } else {
        fetchPage(page); // stay on current page
      }
    } catch (err) {
      console.error("Failed to delete racehorse:", err);
      alert("Delete failed");
    }
  };


  return (
    <div className="racehorses-page">
      <h1 className="page-title">Racehorses</h1>

      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => fetchPage(1)}>Search</button>
        <button onClick={() => setShowFilterModal(true)}>⚙️ Filters</button>
        <button onClick={() => setShowOrderModal(true)}>⇅ Sort</button>
      </div>


      {user && (
        <button className="add-button" onClick={() => setShowModal(true)}>
          Add Racehorse
        </button>
      )}

      <div className="racehorse-grid">
        {items.map((horse) => (
          <div key={horse.id} className="racehorse-card">
            <img
              src={horse.image || defaultHorse}
              alt={horse.name}
              className="racehorse-image"
            />
            <div className="racehorse-info">
              <h3>{horse.name}</h3>
              <p><strong>Breed:</strong> {horse.breed || "Unknown"}</p>
              <p><strong>Country:</strong> {horse.country || "Unknown"}</p>
              <p><strong>Wins:</strong> {horse.total_wins} / {horse.total_races}</p>
              <p><strong>Win Rate:</strong> {horse.win_rate}%</p>
              <div className="card-actions">
                <Link to={`/racehorses/${horse.id}`}>
                  <button>View</button>
                </Link>
                {user && (
                  <>
                    <button onClick={() => setEditingHorse(horse)}>Edit</button>
                    <button onClick={() => setConfirmDelete(horse)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

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
      {showOrderModal && (
        <OrderModal
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

export default Racehorses;
