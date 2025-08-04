import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { csrf } from "../../../api/axios";
import "../../../css/backend/admin/user/show.css";

const UserShow = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        await csrf();
        const { data } = await api.get(`/user/${id}`);
        setUser(data.data);
        setStatus(data.data.status); // Set initial status
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message ?? "Failed to load user.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await csrf();
      await api.put(`/user/${id}`, { status });
      navigate(0); // Refresh the page
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!user) return <p className="no-data">No user found.</p>;

  const profileImage = user.user_detail?.image
    ? `/images/profiles/${user.user_detail.image.split("/").pop()}`
    : null;

  return (
    <div className="user-show-page">
      <header className="page-header">
        <h2>User Details</h2>
        <div className="header-action">
          <Link to="/admin/user" className="btn btn-secondary">Back</Link>
        </div>
      </header>

      <div className="user-details">
        <div className="profile-section">
          {user.user_detail?.image ? (
            <img src={profileImage} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar no-avatar">No Image</div>
          )}
        </div>

        <div className="info-section">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone ?? "-"}</p>
          <p><strong>Email Verified:</strong> 
            <span className={`status-badge ${user.email_verified ? "active" : "inactive"}`}>
              {user.email_verified ? "Yes" : "No"}
            </span>
          </p>
          <p><strong>Roles:</strong> {user.roles?.map(r => r.name).join(", ") || "-"}</p>
          <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>

          {/* Status Update Form */}
          <form onSubmit={handleStatusUpdate} className="status-form">
            
            <strong>Status:</strong>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value={1}
                  checked={status === 1}
                  onChange={() => setStatus(1)}
                />
                Approved
              </label>
              <label>
                <input
                  type="radio"
                  value={0}
                  checked={status === 0}
                  onChange={() => setStatus(0)}
                />
                Pending
              </label>
            </div>
            <button type="submit" className="btn btn-primary">Update Status</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserShow;
