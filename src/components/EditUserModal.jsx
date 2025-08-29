import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";

function EditUserModal({ user, onClose, onSuccess }) {
  const { fetchWithAuth, currentUser } = useAuth();

  const [form, setForm] = useState({
    username: user.username || "",
    email: user.email || "",
    is_staff: user.is_staff || false, // included for admins only
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only include is_staff if current user is admin
    const payload = { ...form };
    if (!currentUser?.is_staff) {
      delete payload.is_staff;
    }

    try {
      const updated = await fetchWithAuth(`/users/${user.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onSuccess(updated);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {currentUser?.is_staff && (
            <label>
              Admin:
              <input
                type="checkbox"
                name="is_staff"
                checked={form.is_staff}
                onChange={handleChange}
              />
            </label>
          )}

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
