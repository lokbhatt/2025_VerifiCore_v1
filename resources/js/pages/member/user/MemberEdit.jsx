import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { csrf } from "../../../api/axios";
import "../../../css/backend/admin/user/edit.css";

const MemberEdit = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    status: 0,
    address: "",
    image: null,
  });
  const [preview, setPreview] = useState(null); // For live image preview
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
          address: userData.user_detail?.address ?? "",
          image: null, // image not pre-filled
        });

        if (userData.user_detail?.image) {
          setPreview(`/${userData.user_detail.image}`);
        }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file)); // preview new image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await csrf();
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      await api.post(`/user/${id}?_method=PUT`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
    } catch (err) {
      console.error(err);
      setError("Failed to update user.");
    }
  };

  if (loading) return <p className="loading-text">Loading user...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!user) return <p className="no-data">No user found.</p>;

  return (
    <div className="user-edit-page">
      <header className="page-header">
        <h2>Edit Member</h2>
      </header>

      <form onSubmit={handleSubmit} className="edit-form" encType="multipart/form-data">
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
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Profile Image</label>
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Profile Preview" width="120" />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update User
        </button>
      </form>
    </div>
  );
};

export default MemberEdit;
