import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";

function EditJockeyModal({ jockey, onClose, onSuccess }) {
  const { fetchWithAuth } = useAuth();

  const [form, setForm] = useState({
    name: jockey.name || "",
    image: jockey.image || null,
    height_cm: jockey.height_cm || "",
    weight_kg: jockey.weight_kg || "",
    birth_date: jockey.birth_date || null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, image: files[0] });
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
      body = JSON.stringify(form);
      headers["Content-Type"] = "application/json";
    }

    try {
      const updated = await fetchWithAuth(`/jockeys/${jockey.id}/`, {
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
        <h2>Edit Jockey</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="height_cm"
            placeholder="Height (cm)"
            value={form.height_cm}
            onChange={handleChange}
          />
          <input
            type="number"
            name="weight_kg"
            placeholder="Weight (kg)"
            value={form.weight_kg}
            onChange={handleChange}
          />
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
          />
          <input type="file" name="image" onChange={handleChange} />

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

export default EditJockeyModal;
