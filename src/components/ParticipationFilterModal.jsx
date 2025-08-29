import React from "react";
import "../pages/Racehorses.css"; // reuse the modal styles

function ParticipationFilterModal({ filters, onChange, onApply, onClose }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Filters</h2>

        <input
          type="text"
          name="race_name"
          placeholder="Filter by race"
          value={filters.race_name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="jockey_name"
          placeholder="Filter by jockey"
          value={filters.jockey_name}
          onChange={handleChange}
        />

        <label>
          Position (exact):
          <input
            type="number"
            name="position"
            min="1"
            value={filters.position}
            onChange={handleChange}
          />
        </label>

        <label>
          Position (min):
          <input
            type="number"
            name="position_min"
            min="1"
            value={filters.position_min}
            onChange={handleChange}
          />
        </label>

        <label>
          Position (max):
          <input
            type="number"
            name="position_max"
            min="1"
            value={filters.position_max}
            onChange={handleChange}
          />
        </label>

        <div className="modal-buttons">
          <button onClick={onApply}>Apply</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ParticipationFilterModal;
