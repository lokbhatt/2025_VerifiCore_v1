import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import KYCForm from "../../../components/backend/member/KYCForm";

const KycEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch existing KYC
  const fetchKyc = async () => {
    try {
      const res = await api.get(`/kyc/${id}`);
      const data = res.data?.data ?? res.data;

      // Convert boolean fields correctly
      const preparedData = {
        ...data,
        is_passport: Number(data.is_passport),
        is_identification_card: Number(data.is_identification_card),
        is_associate_profession: Number(data.is_associate_profession),
        citizenship_photo_front_url: data.citizenship_photo_front, // for preview
        citizenship_photo_back_url: data.citizenship_photo_back,   // for preview
        citizenship_photo_front: null, // allow file update
        citizenship_photo_back: null,  // allow file update
      };

      setFormData(preparedData);
    } catch (err) {
      console.error("Error fetching KYC:", err);
      alert("Failed to load KYC.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKyc();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const val =
      type === "file"
        ? files[0]
        : name === "is_passport" || name === "is_identification_card" || name === "is_associate_profession"
        ? Number(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Only append file if it's a File object (not null)
      if (key.includes("photo") && value instanceof File) {
        form.append(key, value);
      } else if (typeof value !== "object" && value !== null && value !== undefined) {
        form.append(key, value);
      }
    });

    try {
      setSubmitting(true);
      setErrors({});
      await api.post(`/kyc/${id}?_method=PUT`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/member/kyc");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Update failed:", err);
        alert("KYC update failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !formData) return <p>Loading KYC for edit...</p>;

  return (
    <KYCForm
      formData={formData}
      onChange={handleChange}
      onFileChange={handleChange}
      onCheckboxChange={handleChange}
      onSubmit={handleSubmit}
      isEdit={true}
      loading={submitting}
      errors={errors}
    />
  );
};

export default KycEdit;
