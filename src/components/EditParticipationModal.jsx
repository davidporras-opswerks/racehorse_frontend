import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";

function EditParticipationModal({ participation, onClose, onSuccess }) {
  const { fetchWithAuth } = useAuth();

  const [form, setForm] = useState({
    racehorse: participation.racehorse || "",
    race: participation.race || "",
    jockey: participation.jockey || "",
    position: participation.position || "",
    finish_time: participation.finish_time || "",
    margin: participation.margin || "",
    odds: participation.odds || "",
  });

  const [races, setRaces] = useState([]);
  const [racehorses, setRacehorses] = useState([]);
  const [jockeys, setJockeys] = useState([]);

  useEffect(() => {
    // fetch existing entities for dropdowns
    fetchWithAuth("/races/").then((data) => setRaces(data.results || [])).catch(console.error);
    fetchWithAuth("/racehorses/").then((data) => setRacehorses(data.results || [])).catch(console.error);
    fetchWithAuth("/jockeys/").then((data) => setJockeys(data.results || [])).catch(console.error);
  }, [fetchWithAuth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await fetchWithAuth(`/participations/${participation.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSuccess(updated);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Participation</h2>
        <form onSubmit={handleSubmit}>
          {/* Racehorse select */}
          <label>Racehorse</label>
          <select
            name="racehorse"
            value={form.racehorse}
            onChange={handleChange}
            required
          >
            <option value="">-- Select racehorse --</option>
            {racehorses.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Race select */}
          <label>Race</label>
          <select
            name="race"
            value={form.race}
            onChange={handleChange}
            required
          >
            <option value="">-- Select race --</option>
            {races.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.date})
              </option>
            ))}
          </select>

          {/* Jockey select */}
          <label>Jockey</label>
          <select
            name="jockey"
            value={form.jockey}
            onChange={handleChange}
            required
          >
            <option value="">-- Select jockey --</option>
            {jockeys.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name}
              </option>
            ))}
          </select>

          {/* Other fields */}
          <input
            type="number"
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
          />
          <input
            type="text"
            name="finish_time"
            placeholder="Finish Time"
            value={form.finish_time}
            onChange={handleChange}
          />
          <input
            type="text"
            name="margin"
            placeholder="Margin"
            value={form.margin}
            onChange={handleChange}
          />
          <input
            type="text"
            name="odds"
            placeholder="Odds"
            value={form.odds}
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

export default EditParticipationModal;
