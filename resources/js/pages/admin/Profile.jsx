import React, { useEffect, useState } from "react";
import api, { csrf } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../../css/backend/admin/profile.css";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        await csrf();
        const { data } = await api.get("admin/admin-profile");

        if (data.success) {
          setAdmin(data.data);
        } else {
          setError(data.message || "Unauthorized");
          // Optionally redirect if unauthorized
          // navigate("/login");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  if (loading) return <p>Loading admin profile...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!admin) return <p>No admin data found.</p>;

  return (
    <div className="admin-profile-page">
      <h2>Admin Profile</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Username:</strong> {admin.username}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Phone:</strong> {admin.phone || "-"}</p>
        <p><strong>Role:</strong> {admin.roles?.map(r => r.name).join(", ") || "-"}</p>
        <p><strong>Joined:</strong> {new Date(admin.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default AdminProfile;
