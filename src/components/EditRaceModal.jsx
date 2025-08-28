import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";

function EditRaceModal({ race, onClose, onSuccess }) {
  const { fetchWithAuth } = useAuth();

  const [form, setForm] = useState({
    name: race.name || "",
    date: race.date || "",
    location: race.location || "",
    track_configuration: race.track_configuration || "",
    track_condition: race.track_condition || "",
    classification: race.classification || "",
    season: race.season || "",
    track_length: race.track_length || "",
    prize_money: race.prize_money || "",
    currency: race.currency || "USD",
    track_surface: race.track_surface || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await fetchWithAuth(`/races/${race.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSuccess(updated);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // backend choices
  const trackConfigurations = [
    { value: "left_handed", label: "Left Handed" },
    { value: "right_handed", label: "Right Handed" },
    { value: "straight", label: "Straight" },
  ];

  const trackSurfaces = [
    { value: "D", label: "Dirt" },
    { value: "T", label: "Turf" },
    { value: "S", label: "Synthetic" },
    { value: "O", label: "Other" },
  ];

  const trackConditions = [
    "fast","frozen","good","heavy","muddy","sloppy","slow","wet_fast",
    "firm","hard","soft","yielding","standard","harsh"
  ];

  const classifications = [
    { value: "G1", label: "Grade 1" },
    { value: "G2", label: "Grade 2" },
    { value: "G3", label: "Grade 3" },
    { value: "L", label: "Listed" },
    { value: "H", label: "Handicap" },
    { value: "M", label: "Maiden" },
    { value: "O", label: "Other" },
  ];

  const seasons = [
    { value: "SP", label: "Spring" },
    { value: "SU", label: "Summer" },
    { value: "FA", label: "Fall" },
    { value: "WI", label: "Winter" },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Race</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Race Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <select
            name="track_configuration"
            value={form.track_configuration}
            onChange={handleChange}
            required
          >
            <option value="">-- Track Configuration --</option>
            {trackConfigurations.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <select
            name="track_surface"
            value={form.track_surface}
            onChange={handleChange}
            required
          >
            <option value="">-- Track Surface --</option>
            {trackSurfaces.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <select
            name="track_condition"
            value={form.track_condition}
            onChange={handleChange}
            required
          >
            <option value="">-- Track Condition --</option>
            {trackConditions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            name="classification"
            value={form.classification}
            onChange={handleChange}
            required
          >
            <option value="">-- Classification --</option>
            {classifications.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <select
            name="season"
            value={form.season}
            onChange={handleChange}
            required
          >
            <option value="">-- Season --</option>
            {seasons.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <input
            type="number"
            name="track_length"
            placeholder="Track Length (m)"
            value={form.track_length}
            onChange={handleChange}
          />
          <input
            type="number"
            name="prize_money"
            placeholder="Prize Money"
            value={form.prize_money}
            onChange={handleChange}
          />
          <input
            type="text"
            name="currency"
            placeholder="Currency (e.g. USD, JPY)"
            value={form.currency}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRaceModal;
