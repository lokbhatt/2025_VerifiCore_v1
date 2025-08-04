import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { csrf } from "../../../api/axios";
import "../../../css/backend/admin/user/edit.css";

const UserEdit = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    status: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        await csrf();

        const userRes = await api.get(`/user/${id}`);
        const userData = userRes.data.data;

        setUser(userData);
        setFormData({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          phone: userData.phone ?? "",
          status: userData.status,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await csrf();
      await api.put(`/user/${id}`, formData);
      navigate("/admin/user");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="loading-text">Loading user...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!user) return <p className="no-data">No user found.</p>;

  return (
    <div className="user-edit-page">
      <header className="page-header">
        <h2>Edit Member</h2>
        <div className="header-action">
          <Link to="/admin/user" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="status"
                value={1}
                checked={formData.status === 1}
                onChange={() => setFormData((prev) => ({ ...prev, status: 1 }))}
              />
              Approved
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value={0}
                checked={formData.status === 0}
                onChange={() => setFormData((prev) => ({ ...prev, status: 0 }))}
              />
              Pending
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Update User
        </button>
      </form>
    </div>
  );
};

export default UserEdit;
