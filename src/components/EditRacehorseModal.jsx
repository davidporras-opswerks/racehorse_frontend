import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";

function EditRacehorseModal({ horse, onClose, onSuccess }) {
  const { fetchWithAuth } = useAuth();

  const [form, setForm] = useState({
    name: horse.name || "",
    birth_date: horse.birth_date || "",
    breed: horse.breed || "",
    gender: horse.gender || "",
    country: horse.country || "",
    image: horse.image || null,
    is_active: horse.is_active ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm({ ...form, image: files[0] });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let body;
    let headers = {};
    if (form.image instanceof File) {
      // multipart if uploading a new image
      body = new FormData();
      for (const key in form) {
        if (form[key] !== null && form[key] !== "") {
          body.append(key, form[key]);
        }
      }
    } else {
      // JSON if no new image uploaded
      const jsonForm = { ...form };
      // ❌ Don't send image URL back
      delete jsonForm.image;
      
      body = JSON.stringify(jsonForm);
      headers["Content-Type"] = "application/json";
    }

    try {
      const updated = await fetchWithAuth(`/racehorses/${horse.id}/`, {
        method: "PUT",
        headers,
        body,
      });
      onSuccess(updated);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Racehorse</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
          />
          <input
            name="breed"
            placeholder="Breed"
            value={form.breed}
            onChange={handleChange}
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Gelding">Gelding</option>
          </select>
          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />
          <input type="file" name="image" onChange={handleChange} />

          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active
          </label>

          {/* Read-only computed stats */}
          <div className="racehorse-stats">
            <p><strong>Age:</strong> {horse.age ?? "N/A"}</p>
            <p><strong>Total Races:</strong> {horse.total_races ?? 0}</p>
            <p><strong>Total Wins:</strong> {horse.total_wins ?? 0}</p>
            <p><strong>Win Rate:</strong> {horse.win_rate?.toFixed(2) ?? "0.00"}%</p>
          </div>

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

export default EditRacehorseModal;
