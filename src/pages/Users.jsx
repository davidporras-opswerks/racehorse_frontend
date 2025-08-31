import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import EditUserModal from "../components/EditUserModal";
import defaultAvatar from "../assets/default-avatar.webp"; // fallback avatar

import "./Users.css"; // new stylesheet

function Users() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const pageSize = 10;

  const fetchPage = useCallback(
    (pageNum) => {
      fetchWithAuth(`/users/?page=${pageNum}`)
        .then((data) => {
          setItems(data.results || []);
          setCount(data.count || 0);
          setNext(data.next);
          setPrevious(data.previous);
          setPage(pageNum);
        })
        .catch((err) => {
          console.error(err);
          logout();
        });
    },
    [fetchWithAuth, logout]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleDelete = (userId) => {
    fetchWithAuth(`/users/${userId}/`, { method: "DELETE" })
      .then(() => {
        setItems(items.filter((u) => u.id !== userId));
        setConfirmDelete(null);
      })
      .catch((err) => {
        console.error("Failed to delete user:", err);
        alert("Delete failed");
      });
  };

  return (
    <div className="users-page">
      <h1 className="page-title">Users</h1>

      {(user && user.is_admin) && (
        <Link className="add-button" to="/register">
          Register New User
        </Link>
      )}

      <div className="user-list">
        {items.map((u) => (
          <div key={u.id} className="user-card">
            <img
              src={u.avatar || defaultAvatar}
              alt={u.username}
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
            <div className="user-info">
              <h3>{u.username}</h3>
              <p>{u.email}</p>
              <div className="user-badges">
                {u.is_superuser && <span className="badge superuser">Superuser</span>}
                {!u.is_superuser && u.is_staff && <span className="badge staff">Staff</span>}
                {!u.is_staff && <span className="badge regular">User</span>}
              </div>
            </div>
            <div className="user-actions">
              <Link to={`/users/${u.id}`}>
                <button>View</button>
              </Link>
              {(user && (user.is_admin || Number(user.user_id) === u.id)) && (
                <button onClick={() => setEditingUser(u)}>✏️ Edit</button>
              )}
              {(user && user.is_admin) && (
                <button onClick={() => setConfirmDelete(u)}>🗑️ Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={!previous} onClick={() => fetchPage(page - 1)}>
          ⬅️ Previous
        </button>
        <span>
          Page {page} of {Math.ceil(count / pageSize)}
        </span>
        <button disabled={!next} onClick={() => fetchPage(page + 1)}>
          Next ➡️
        </button>
      </div>

      {/* Modals */}
      {editingUser && (
        <EditUserModal
          editUser={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={(updated) => {
            setItems(items.map((u) => (u.id === updated.id ? updated : u)));
            setEditingUser(null);
          }}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirmDelete.username}"?`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

export default Users;
