import { useState } from "react";
import "./Modal.css"; // 👈 import styles

function AddRacehorseModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    birth_date: "",
    breed: "",
    gender: "",
    country: "",
    image: null,
    is_active: false,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    const res = await fetch("http://127.0.0.1:8000/api/racehorses/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      const newHorse = await res.json();
      setMessage("✅ Racehorse added!");
      onSuccess(newHorse);
    } else {
      const err = await res.json();
      setMessage("❌ Error: " + JSON.stringify(err));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add Racehorse</h2>
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
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
          />
          <input
            type="text"
            name="breed"
            placeholder="Breed"
            value={form.breed}
            onChange={handleChange}
          />
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <label>
            Active?
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
          </label>
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

export default AddRacehorseModal;
