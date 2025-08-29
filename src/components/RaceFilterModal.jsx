import React from "react";
import "../pages/Racehorses.css";

function RaceFilterModal({ filters, onChange, onApply, onClose }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  // TrackSurface options
  const trackSurfaceOptions = [
    { value: "", label: "All surfaces" },
    { value: "D", label: "Dirt" },
    { value: "T", label: "Turf" },
    { value: "S", label: "Synthetic" },
    { value: "O", label: "Other" },
  ];

  // TrackCondition options
  const trackConditionOptions = [
    { value: "", label: "All conditions" },
    { value: "fast", label: "Fast" },
    { value: "frozen", label: "Frozen" },
    { value: "good", label: "Good" },
    { value: "heavy", label: "Heavy" },
    { value: "muddy", label: "Muddy" },
    { value: "sloppy", label: "Sloppy" },
    { value: "slow", label: "Slow" },
    { value: "wet_fast", label: "Wet Fast" },
    { value: "firm", label: "Firm" },
    { value: "hard", label: "Hard" },
    { value: "soft", label: "Soft" },
    { value: "yielding", label: "Yielding" },
    { value: "standard", label: "Standard" },
    { value: "harsh", label: "Harsh" },
  ];

  const classificationOptions = [
    { value: "", label: "All classifications" },
    { value: "G1", label: "Grade 1" },
    { value: "G2", label: "Grade 2" },
    { value: "G3", label: "Grade 3" },
    { value: "L", label: "Listed" },
    { value: "H", label: "Handicap" },
    { value: "M", label: "Maiden" },
    { value: "O", label: "Other" },
  ];

  const seasonOptions = [
    { value: "", label: "All seasons" },
    { value: "SP", label: "Spring" },
    { value: "SU", label: "Summer" },
    { value: "FA", label: "Fall" },
    { value: "WI", label: "Winter" },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Filters</h2>

        <input
          type="text"
          name="location"
          placeholder="Filter by location"
          value={filters.location}
          onChange={handleChange}
        />

        <select
          name="track_surface"
          value={filters.track_surface}
          onChange={handleChange}
        >
          {trackSurfaceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          name="track_condition"
          value={filters.track_condition}
          onChange={handleChange}
        >
          {trackConditionOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          name="classification"
          value={filters.classification}
          onChange={handleChange}
        >
          {classificationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          name="season"
          value={filters.season}
          onChange={handleChange}
        >
          {seasonOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <label>
          Date After:
          <input
            type="date"
            name="date_after"
            value={filters.date_after}
            onChange={handleChange}
          />
        </label>

        <label>
          Date Before:
          <input
            type="date"
            name="date_before"
            value={filters.date_before}
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

export default RaceFilterModal;
