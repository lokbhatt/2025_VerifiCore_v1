import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, {csrf} from "../../../../api/axios";
import { Link } from "react-router-dom";
import MainForm from "../../../../components/backend/admin/ParentData/Municipality/MainForm";

const MunicipalityCreate = () => {
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    key: "",
    status: "1",
    district_id: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistricts = async () => {
        try {
            await csrf();
            const res = await api.get("/parent-data/districts");
            setDistricts(res.data.data);
        } catch (err) {
            console.error("Failed to load districts", err);
        }
    };
    fetchDistricts();
  }, []);

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
    if (!formData.district_id) {
        formErrors.district_id = "District is required.";
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
        district_id: parseInt(formData.district_id),
      };
      const res= await api.post("/parent-data/municipality", payload) 
      navigate("/admin/parent-data/municipality");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || error.response.data.data || {});
      } else {
        console.log("Failed to create municipality. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center justify-around mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Municipality</h2>
          <Link to="/admin/parent-data/municipality" className="btn btn-secondary bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded transition">
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
        districts={districts}
      />
    </div>
  );
};

export default MunicipalityCreate;
