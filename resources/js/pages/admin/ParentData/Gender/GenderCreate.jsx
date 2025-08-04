import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, {csrf} from "../../../../api/axios";
import { Link } from "react-router-dom";
import MainForm from "../../../../components/backend/admin/ParentData/gender/MainForm";

const GenderCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    key: "",
    status: "1",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

    if (!formData.title.trim()) {
      formErrors.title = "Title is required.";
    }

    if (!formData.key.trim()) {
      formErrors.key = "Key is required.";
    }
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
        status: parseInt(formData.status),
      };
      const res= await api.post("/parent-data/gender", formData) 
      navigate("/admin/parent-data/gender");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || error.response.data.data || {});
      } else {
        console.log("Failed to create gender. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-page px-6 py-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-around mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New gender</h2>
          <Link to="/admin/parent-data/gender" className="btn btn-secondary bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded transition">
            Back to Index
          </Link>
      </header>
      <MainForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEdit={false}
        loading={isSubmitting}
        errors={errors}
      />
    </div>
  );
};

export default GenderCreate;
