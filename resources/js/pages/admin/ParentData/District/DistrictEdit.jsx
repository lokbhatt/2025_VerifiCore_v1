import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { csrf } from "../../../../api/axios";
import { Link } from "react-router-dom";
import MainForm from "../../../../components/backend/admin/ParentData/District/MainForm";

const DistrictEdit = () => {
  const { id } = useParams(); // Get ID from route
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    key: "",
    status: "1",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch existing district data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/parent-data/districts/${id}`);
        const district = res.data.data;
        setFormData({
          title: district.title || "",
          key: district.key || "",
          status: String(district.status ?? "1"),
        });
      } catch (err) {
        console.error("Error fetching district:", err);
        navigate("/admin/parent-data/district");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
        const generatedKey = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

        setFormData((prev) => ({
        ...prev,
        title: value,
        key: generatedKey,
        }));
    } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.title.trim()) formErrors.title = "Title is required.";
    if (!formData.key.trim()) formErrors.key = "Key is required.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});

    try {
      await csrf();
      const payload = {
        ...formData,
        status: parseInt(formData.status), // ensure it's int (e.g., 1 or 0)
      };
      await api.put(`/parent-data/districts/${id}`, payload);
      navigate("/admin/parent-data/district");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Update failed:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading district...</div>;

  return (
    <div className="district-edit-page px-6 py-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-around mb-6">
        <h2 className="text-2xl font-bold">District Edit</h2>
        <div className="flex gap-2">
          <Link to="/admin/parent-data/district/create" className="btn btn-primary bg-green-600 text-white px-4 py-2 rounded">
            + Add New
          </Link>
          <Link to="/admin/parent-data/district" className="btn btn-secondary bg-gray-600 text-white px-4 py-2 rounded">
            Back to Index
          </Link>
        </div>
      </header>
      <MainForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEdit={true}
        loading={isSubmitting}
        errors={errors}
      />
    </div>
  );
};

export default DistrictEdit;
