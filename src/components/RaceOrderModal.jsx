import React from "react";
import "./FilterModal.css"; // reuse the same styling

function RaceOrderModal({ ordering, onChange, onApply, onClose }) {
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
          <option value="date">Date ↑</option>
          <option value="-date">Date ↓</option>
          <option value="track_length">Track Length ↑</option>
          <option value="-track_length">Track Length ↓</option>
          <option value="prize_money">Prize Money ↑</option>
          <option value="-prize_money">Prize Money ↓</option>
        </select>
        <button onClick={onApply}>Apply</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default RaceOrderModal;
