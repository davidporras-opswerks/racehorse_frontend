import { useState } from "react";
import "./Modal.css"; // reuse the same modal styles

function AddJockeyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    image: null,
    height_cm: "",
    weight_kg: "",
    birth_date: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") formData.append(key, value);
    });

    const res = await fetch("http://127.0.0.1:8000/api/jockeys/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      const newJockey = await res.json();
      setMessage("✅ Jockey added!");
      onSuccess(newJockey);
    } else {
      const err = await res.json();
      setMessage("❌ Error: " + JSON.stringify(err));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add Jockey</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
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

export default AddJockeyModal;
