import React from "react";
import "./FilterModal.css"

function FilterModal({ filters, onChange, onApply, onClose }) {
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
          name="breed"
          placeholder="Filter by breed"
          value={filters.breed}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Filter by country"
          value={filters.country}
          onChange={handleChange}
        />
        <select
          name="is_active"
          value={filters.is_active}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button onClick={onApply}>Apply</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default FilterModal;
