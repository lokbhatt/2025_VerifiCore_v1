import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { csrf } from "../../../../api/axios";
import { Link } from "react-router-dom";
import MainForm from "../../../../components/backend/admin/ParentData/Municipality/MainForm";

const MunicipalityEdit = () => {
  const [districts, setDistricts] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    district_id: "",
    title: "",
    key: "",
    status: "1",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
         const [municipalityRes, districtsRes] = await Promise.all([
            api.get(`/parent-data/municipality/${id}`),
            api.get("/parent-data/districts"),
        ]);
        const municipality = municipalityRes.data.data;
        setFormData({
            district_id: Number(municipality.district?.id) || "",
            title: municipality.title || "",
            key: municipality.key || "",
            status: String(municipality.status ?? "1"),
        });
        setDistricts(districtsRes.data.data || []);
      } catch (err) {
        console.error("Error fetching municipality:", err);
        navigate("/admin/parent-data/municipality");
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
      await api.put(`/parent-data/municipality/${id}`, payload);
      navigate("/admin/parent-data/municipality");
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

  if (loading) return <div>Loading municipality...</div>;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-around mb-6">
        <h2 className="text-2xl font-bold">Municipality Edit</h2>
        <div className="flex gap-2">
          <Link to="/admin/parent-data/municipality/create" className="btn btn-primary bg-green-600 text-white px-4 py-2 rounded">
            + Add New
          </Link>
          <Link to="/admin/parent-data/municipality" className="btn btn-secondary bg-gray-600 text-white px-4 py-2 rounded">
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
        districts={districts}
      />
    </div>
  );
};

export default MunicipalityEdit;
