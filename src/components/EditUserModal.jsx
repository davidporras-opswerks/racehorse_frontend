import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";
import defaultAvatar from "../assets/default-avatar.webp";

function EditUserModal({ editUser, onClose, onSuccess }) {
  const { fetchWithAuth, user } = useAuth();

  const [form, setForm] = useState({
    username: editUser.username || "",
    email: editUser.email || "",
    is_staff: editUser.is_staff || false,
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(editUser.avatar || defaultAvatar);

  // Password states (only new password now)
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check password match if provided
    if (newPassword1 || newPassword2) {
      if (newPassword1 !== newPassword2) {
        setError("New passwords do not match.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);

    if (user?.is_admin) {
      formData.append("is_staff", form.is_staff ? "true" : "false");
    }

    if (form.avatar) {
      formData.append("avatar", form.avatar);
    }

    // If password is being changed
    if (newPassword1) {
      formData.append("password", newPassword1);
    }

    try {
      const updated = await fetchWithAuth(`/users/${editUser.id}/`, {
        method: "PUT",
        body: formData,
      });
      onSuccess(updated);
    } catch (err) {
      console.error("Update failed", err);
      setError("Update failed. Please try again.");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) onClose();
  };

  let fileInputRef;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Account</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Avatar preview clickable */}
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <img
              src={avatarPreview || "/default-avatar.png"}
              alt="Avatar Preview"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.click()}
            />
            <input
              type="file"
              name="avatar"
              accept="image/*"
              style={{ display: "none" }}
              ref={(ref) => (fileInputRef = ref)}
              onChange={handleChange}
            />
          </div>

          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          {/* Admin checkbox */}
          {user?.is_admin && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_staff"
                checked={form.is_staff}
                onChange={(e) =>
                  setForm({ ...form, is_staff: e.target.checked })
                }
              />
              Admin
            </label>
          )}

          {/* Password section */}
          <h3 style={{ marginTop: "1rem" }}>Change Password</h3>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword1}
            onChange={(e) => setNewPassword1(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

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

export default EditUserModal;
