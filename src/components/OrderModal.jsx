import React from "react";
import "./FilterModal.css"; // reuse the same styling

function OrderModal({ ordering, onChange, onApply, onClose }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sort By</h2>
        <select value={ordering} onChange={handleChange}>
          <option value="">Default</option>
          <option value="name">Name ↑</option>
          <option value="-name">Name ↓</option>
          <option value="birth_date">Birth Date ↑</option>
          <option value="-birth_date">Birth Date ↓</option>
          <option value="pk">ID ↑</option>
          <option value="-pk">ID ↓</option>
        </select>
        <button onClick={onApply}>Apply</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default OrderModal;
