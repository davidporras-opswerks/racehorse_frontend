import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AddParticipationModal from "../components/AddParticipationModal";
import EditParticipationModal from "../components/EditParticipationModal";
import ConfirmModal from "../components/ConfirmModal";
import ParticipationFilterModal from "../components/ParticipationFilterModal";
import "./Racehorses.css";
import defaultHorse from "../assets/default-horse.webp";

function Participations() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingParticipation, setEditingParticipation] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    race_name: "",
    jockey_name: "",
    position: "",
    position_min: "",
    position_max: "",
  });
  const [search, setSearch] = useState("");

  // Season mapping
  const seasonMap = {
    SP: "Spring",
    SU: "Summer",
    FA: "Fall",
    WI: "Winter",
  };


  const fetchPage = useCallback(
    (pageNum = 1) => {
      const params = new URLSearchParams({ page: pageNum });

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") {
          if (key === "position") params.append("position", value);
          if (key === "position_min") params.append("position__gte", value);
          if (key === "position_max") params.append("position__lte", value);
          if (key === "race_name") params.append("race__name__icontains", value);
          if (key === "jockey_name") params.append("jockey__name__icontains", value);
        }
      });

      if (search.trim() !== "") {
        params.append("search", search);
      }

      fetchWithAuth(`/participations/?${params.toString()}`)
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

  // Group participations by race name + date + season
  const groupedByRace = items.reduce((groups, p) => {
    const seasonName = seasonMap[p.race_season] || p.race_season;
    const key = `${p.race_name} | ${p.race_date} (${seasonName})`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
    return groups;
  }, {});



  return (
    <div className="racehorses-page">
      <h1 className="page-title">Participations</h1>

      {/* Search + Filters */}
      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search by racehorse name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => fetchPage(1)}>Search</button>
        <button onClick={() => setShowFilterModal(true)}>⚙️ Filters</button>
      </div>

      {/* Add button */}
      {user && (
        <button className="add-button" onClick={() => setShowModal(true)}>
          Add Participation
        </button>
      )}

      {/* Races with their participations */}
      {Object.keys(groupedByRace).map((raceKey) => (
        <div key={raceKey} className="race-section">
          <h2 className="race-title">{raceKey}</h2>
          <div className="racehorse-grid">
            {groupedByRace[raceKey].map((p) => (
              <div key={p.id} className="racehorse-card">
                <img
                  src={p.racehorse_image || defaultHorse}
                  alt={p.racehorse_name}
                  className="racehorse-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultHorse;
                  }}
                />
                <div className="racehorse-info">
                  <h3>
                    {p.racehorse_name}{" "}
                    {p.is_winner && <span style={{ color: "gold" }}>🏆</span>}
                  </h3>
                  <p>
                    <strong>Jockey:</strong> {p.jockey_name}
                  </p>
                  <p>
                    <strong>Position:</strong> {p.position} — {p.result_status}
                  </p>
                  {p.finish_time && (
                    <p>
                      <strong>Time:</strong> {p.finish_time}
                    </p>
                  )}
                  {p.margin && (
                    <p>
                      <strong>Margin:</strong> {p.margin} lengths
                    </p>
                  )}
                  {p.odds && (
                    <p>
                      <strong>Odds:</strong> {p.odds}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="card-actions">
                    <Link to={`/participations/${p.id}`}>
                      <button>View</button>
                    </Link>
                    {user && (
                      <>
                        <button onClick={() => setEditingParticipation(p)}>
                          Edit
                        </button>
                        <button onClick={() => setConfirmDelete(p)}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

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
      {showFilterModal && (
        <ParticipationFilterModal
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

export default Participations;
