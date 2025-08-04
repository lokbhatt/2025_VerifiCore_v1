import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api, { csrf } from "../../../api/axios";
import useConfirmDialog from "../../../components/useConfirmDialog";
import "../../../css/backend/admin/user/trash.css";

const UserTrash = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const confirm = useConfirmDialog();

  const fetchTrashedUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await csrf();

      const { data } = await api.get("/user/trash");

      if (Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        throw new Error("Unexpected data format received from the server.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setUsers([]);
      setError(err.response?.data?.message ?? err.message ?? "Failed to fetch trashed users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrashedUsers();
  }, [fetchTrashedUsers]);

  const handleRestore = async (id) => {
    const result = await confirm({
      title: "Restore this member?",
      text: "The member will be restored and active again.",
      icon: "question",
      confirmText: "Yes, restore",
    });

    if (result.isConfirmed) {
      try {
        await csrf();
        await api.put(`/user/${id}/restore`);
        fetchTrashedUsers(); // Refresh list
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleForceDelete = async (id) => {
    const result = await confirm({
      title: "Are you sure?",
      text: "This will permanently delete the user.",
      icon: "warning",
      confirmText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        await csrf();
        await api.delete(`/user/${id}/force-delete`);
        fetchTrashedUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="trash-page">
      <header className="page-header">
        <h2>Trashed Members</h2>
        <Link to="/admin/user" className="btn btn-secondary">
          Back to Members
        </Link>
      </header>

      {loading && <p className="loading-text">Loading trashed members...</p>}

      {!loading && error && (
        <p className="error-text" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Deleted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.status === 1 ? "active" : "inactive"
                      }`}
                    >
                      {user.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(user.deleted_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleRestore(user.id)}
                      className="btn btn-sm btn-success"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handleForceDelete(user.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete Permanently
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No trashed members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTrash;
