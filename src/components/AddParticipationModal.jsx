import { useEffect, useState } from "react";
import "./Modal.css";

function AddParticipationModal({ onClose, onSuccess, defaultRacehorseId, defaultJockeyId, defaultRaceId }) {
  const [form, setForm] = useState({
    race: defaultRaceId || "",
    racehorse: defaultRacehorseId || "", // set default
    jockey: defaultJockeyId || "",
    position: "",
    finish_time: "",
    margin: "",
    odds: "",
  });
  const [message, setMessage] = useState("");

  const [existingRaces, setExistingRaces] = useState([]);
  const [existingRacehorses, setExistingRacehorses] = useState([]);
  const [existingJockeys, setExistingJockeys] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("http://127.0.0.1:8000/api/races/", { headers }).then((r) => r.json()),
      fetch("http://127.0.0.1:8000/api/racehorses/", { headers }).then((r) => r.json()),
      fetch("http://127.0.0.1:8000/api/jockeys/", { headers }).then((r) => r.json()),
    ]).then(([races, horses, jockeys]) => {
      setExistingRaces(races.results || races);
      setExistingRacehorses(horses.results || horses);
      setExistingJockeys(jockeys.results || jockeys);
    });
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    const payload = {
      ...form,
      race: form.race ? parseInt(form.race) : null,
      racehorse: form.racehorse ? parseInt(form.racehorse) : null,
      jockey: form.jockey ? parseInt(form.jockey) : null,
    };

    const res = await fetch("http://127.0.0.1:8000/api/participations/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newParticipation = await res.json();
      setMessage("✅ Participation added!");
      onSuccess(newParticipation);
    } else {
      const err = await res.json();
      setMessage("❌ Error: " + JSON.stringify(err));
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Add Participation</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <select
            value={form.race}
            onChange={(e) => handleChange("race", e.target.value)}
            required
          >
            <option value="">-- Select Race --</option>
            {existingRaces.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} || {r.date} ({r.season})
              </option>
            ))}
          </select>

          <select
            value={form.racehorse}
            onChange={(e) => handleChange("racehorse", e.target.value)}
            required
          >
            <option value="">-- Select Racehorse --</option>
            {existingRacehorses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          <select
            value={form.jockey}
            onChange={(e) => handleChange("jockey", e.target.value)}
            required
          >
            <option value="">-- Select Jockey --</option>
            {existingJockeys.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Position"
            value={form.position}
            onChange={(e) => handleChange("position", e.target.value)}
          />
          <input
            type="text"
            placeholder="Finish Time"
            value={form.finish_time}
            onChange={(e) => handleChange("finish_time", e.target.value)}
          />
          <input
            type="text"
            placeholder="Margin"
            value={form.margin}
            onChange={(e) => handleChange("margin", e.target.value)}
          />
          <input
            type="text"
            placeholder="Odds"
            value={form.odds}
            onChange={(e) => handleChange("odds", e.target.value)}
          />

          <div className="modal-actions">
            <button type="submit" className="modal-button submit">
              Add
            </button>
            <button
              type="button"
              className="modal-button cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddParticipationModal;
