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
    is_active: horse.is_active || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let body;
    let headers = {};
    if (form.image) {
      // multipart if uploading an image
      body = new FormData();
      for (const key in form) {
        body.append(key, form[key]);
      }
    } else {
      // JSON if no image
      body = JSON.stringify(form);
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
            name="birth_date"
            type="date"
            value={form.birth_date}
            onChange={handleChange}
          />
          <input
            name="breed"
            placeholder="Breed"
            value={form.breed}
            onChange={handleChange}
          />
          <input
            name="gender"
            placeholder="Gender"
            value={form.gender}
            onChange={handleChange}
          />
          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />
          <label>
            Active:
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
          </label>
          <input type="file" name="image" onChange={handleChange} />

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRacehorseModal;
