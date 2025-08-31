import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";
import defaultJockey from "../assets/default-jockey.webp"

function EditJockeyModal({ jockey, onClose, onSuccess }) {
  const { fetchWithAuth } = useAuth();

  const [form, setForm] = useState({
    name: jockey.name || "",
    image: jockey.image || null,
    height_cm: jockey.height_cm || "",
    weight_kg: jockey.weight_kg || "",
    birth_date: jockey.birth_date || "",
  });

  const [imagePreview, setImagePreview] = useState(jockey.image || null);
  let fileInputRef;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files[0]) {
      setForm({ ...form, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let body;
    let headers = {};
    if (form.image instanceof File) {
      body = new FormData();
      for (const key in form) {
        if (form[key] !== null && form[key] !== "") {
          body.append(key, form[key]);
        }
      }
    } else {
      const jsonForm = { ...form };
      delete jsonForm.image;
      body = JSON.stringify(jsonForm);
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

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Jockey</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Image preview at the top */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={imagePreview || defaultJockey}
              alt="Jockey Preview"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.click()}
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              style={{ display: "none" }}
              ref={(ref) => (fileInputRef = ref)}
              onChange={handleChange}
            />
          </div>

          <input
            name="name"
            type="text"
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
            value={form.birth_date || ""}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit" className="modal-button submit">
              Save
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

export default EditJockeyModal;
