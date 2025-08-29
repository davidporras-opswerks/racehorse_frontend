import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EditUserModal from "../components/EditUserModal";
import ConfirmModal from "../components/ConfirmModal";


function UserProfile() {
  const { id } = useParams();
  const { fetchWithAuth, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithAuth(`/users/${id}/`)
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch user profile");
      });
  }, [fetchWithAuth, id]);

  const handleDelete = () => {
    fetchWithAuth(`/users/${id}/`, { method: "DELETE" })
      .then(() => navigate("/users"))
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete");
      });
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>{profile.get_full_name || profile.username}</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Staff:</strong> {profile.is_staff ? "Yes" : "No"}</p>
      <p><strong>Superuser:</strong> {profile.is_superuser ? "Yes" : "No"}</p>

      <button onClick={() => navigate(-1)}>⬅ Back</button>
      {(user && (user.is_admin || Number(user.user_id) === profile.id)) && <button onClick={() => setShowEdit(true)}>✏️ Edit</button>}
      {(user && user.is_admin) && <button onClick={() => setConfirmDelete(true)}>🗑️ Delete</button>}
      
      {showEdit && (
        <EditUserModal
          user={profile}
          onClose={() => setShowEdit(false)}
          onSuccess={(updated) => {
            setProfile(updated);
            setShowEdit(false);
          }}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${profile.username}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

export default UserProfile;
