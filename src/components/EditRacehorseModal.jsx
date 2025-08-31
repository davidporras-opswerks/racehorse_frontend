import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";
import defaultHorse from "../assets/default-horse.webp"

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

  const [imagePreview, setImagePreview] = useState(horse.image || null);
  let fileInputRef;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file" && files[0]) {
      setForm({ ...form, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
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

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Racehorse</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Image preview at the top */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src={imagePreview || defaultHorse}
              alt="Racehorse Preview"
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
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
          />
          <input
            name="breed"
            type="text"
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
            type="text"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />

          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active
          </label>

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

export default EditRacehorseModal;
