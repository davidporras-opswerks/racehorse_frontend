import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import EditUserModal from "../components/EditUserModal";

function Users() {
  const { fetchWithAuth, logout, user } = useAuth();
  const [items, setItems] = useState([]);
  // const [showEdit, setShowEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const pageSize = 10; // Django default unless overridden

  const fetchPage = useCallback((pageNum) => {
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
  }, [fetchWithAuth, logout]);

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
        console.error("Failed to delete racehorse:", err);
        alert("Delete failed");
      });
  };

  return (
    <div>
      <h1>Users</h1>
      {(user && user.is_admin) && (
        <Link className="" to="/register">Register</Link>
      )}

      <ul>
        {items.map((u) => (
          <li key={u.id}>
            {u.username}{" "}
            <Link to={`/users/${u.id}`}>
              <button>View Details</button>
            </Link>
            {(user &&(user.is_admin || Number(user.user_id) === u.id)) && (<button onClick={() => setEditingUser(u)}>✏️ Edit</button>)}
            {(user && user.is_admin) && <button onClick={() => setConfirmDelete(u)}>🗑️ Delete</button>}
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div style={{ marginTop: "1rem" }}>
        <button
          disabled={!previous}
          onClick={() => fetchPage(page - 1)}
        >
          ⬅️ Previous
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {Math.ceil(count / pageSize)}
        </span>
        <button
          disabled={!next}
          onClick={() => fetchPage(page + 1)}
        >
          Next ➡️
        </button>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={(updated) => {
            setItems(items.map((u) => (u.id === updated.id ? updated : u)));
            setEditingUser(null);
          }}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirmDelete.name}"?`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

export default Users;
