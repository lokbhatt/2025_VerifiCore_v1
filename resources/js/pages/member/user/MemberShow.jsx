import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { csrf } from "../../../api/axios";
import "../../../css/backend/admin/user/show.css";

const MemberShow = () => {
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
        setStatus(data.data.status);
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
      navigate(0);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!user) return <p className="no-data">No user found.</p>;

  // Build correct URL for the profile image
  const profileImage = user.user_detail?.image
    ? `/images/profiles/${user.user_detail.image.split("/").pop()}`
    : null;

  return (
    <div className="user-show-page">
      <header className="page-header">
        <h2>User Details</h2>
      </header>

      <div className="user-details">
        <div className="profile-section">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar no-avatar">No Image</div>
          )}
        </div>

        <div className="info-section">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone ?? "-"}</p>
          <p>
            <strong>Email Verified:</strong>
            <span className={`status-badge ${user.email_verified ? "active" : "inactive"}`}>
              {user.email_verified ? "Yes" : "No"}
            </span>
          </p>
          <p><strong>Role:</strong> {user.roles?.map(r => r.name).join(", ") || "-"}</p>
          <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status-badge ${status === 1 ? "approved" : "pending"}`}>
              {status === 1 ? "Approved" : "Pending"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberShow;
