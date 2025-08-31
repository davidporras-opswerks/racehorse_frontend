import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";

function EditUserModal({ editUser, onClose, onSuccess }) {
  const { fetchWithAuth, user } = useAuth();

  const [form, setForm] = useState({
    username: editUser.username || "",
    email: editUser.email || "",
    is_staff: editUser.is_staff || false, // included for admins only
    avatar: null, // new field
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);

    if (user?.is_admin) {
      formData.append("is_staff", form.is_staff ? "true" : "false");
    }

    if (form.avatar) {
      formData.append("avatar", form.avatar);
    }
    for (let [key, value] of formData.entries()) {
      console.log("FormData field:", key, value);
    }

    try {
      const updated = await fetchWithAuth(`/users/${editUser.id}/`, {
        method: "PATCH",
        body: formData,
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

          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
          />

          {user?.is_admin && (
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
