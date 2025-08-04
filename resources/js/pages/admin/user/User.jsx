import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api, { csrf } from "../../../api/axios";
import useConfirmDialog from "../../../components/useConfirmDialog";
import "../../../css/backend/admin/user/index.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const confirm = useConfirmDialog();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await csrf();

      const { data } = await api.get("/user");

      let items = data?.data;
      if (Array.isArray(items)) {
        // Filter out users with 'admin' role
        items = items.filter(user => {
          return !user.roles?.some(role => role.name.toLowerCase() === "admin");
        });
        setUsers(items);
      } else {
        throw new Error("Unexpected data format received from the server.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setUsers([]);
      setError(
        err.response?.data?.message ??
          err.message ??
          "Failed to fetch users."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    const result = await confirm({
      title: "Are you sure you want to delete this member?",
      text: "This action cannot be undone.",
      icon: "warning",
      confirmText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        await csrf();
        await api.delete(`/user/${id}`);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="index-page">
      <header className="page-header">
        <h2>Member List</h2>
        <div className="header-action">
          <Link to="/admin/user/trash" className="btn btn-danger">
            Trash
          </Link>
        </div>
      </header>

      {loading && <p className="loading-text">Loading members...</p>}

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
              <th>Phone</th>
              <th>Email Verified</th>
              <th>Status</th>
              <th>Roles</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.phone ?? "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.email_verified ? "active" : "inactive"
                      }`}
                    >
                      {user.email_verified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.status === 1 ? "active" : "inactive"
                      }`}
                    >
                      {user.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    {user.roles?.length
                      ? user.roles.map((role) => role.name).join(", ")
                      : "-"}
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`/admin/user/${user.id}`}
                      className="btn btn-sm btn-info"
                    >
                      Show
                    </Link>
                    <Link
                      to={`/admin/user/${user.id}/edit`}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="no-data">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default User;
