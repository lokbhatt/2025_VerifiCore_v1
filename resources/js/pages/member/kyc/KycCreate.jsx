import React, { useState } from "react";
import api from "../../../api/axios";
import KYCForm from '../../../components/backend/member/KYCForm';
import { useNavigate } from "react-router-dom";

const initialState = {
  // Permanent Address
  district_id: "",
  municipality_id: "",
  ward_id: "",
  tole: "",
  house_number: "",

  // Temporary Address
  temp_district_id: "",
  temp_municipality_id: "",
  temp_ward_id: "",
  temp_tole: "",
  temp_house_number: "",

  // Personal Information
  name: "",
  dob: "",
  gender_id: "",
  marital_status: "",
  nationality: "",

  // Contact Information
  email: "",
  phone: "",
  landline: "",

  // Family Information
  father: "",
  mother: "",
  grandfather: "",
  spouse: "",

  // Citizenship Information
  citizenship_photo_front: null,
  citizenship_photo_back: null,
  citizenship_number: "",
  citizenship_issued_by: "",
  citizenship_issued_date: "",
  citizenship_issued_place: "",

  // Passport Information
  is_passport: false,
  passport_number: "",
  passport_issued_by: "",
  passport_issued_date: "",
  passport_expire_date: "",

  // Identification Card Information
  is_identification_card: false,
  identification_card_type: "",
  identification_card_number: "",
  identification_card_issued_date: "",
  identification_card_expire_date: "",

  // Associate Profession
  is_associate_profession: false,
  organization_name: "",
  organization_address: "",
  organization_contact_number: "",
  designation: "",
  estimated_annual_income: "",
  estimated_annual_transaction: "",

  // Status & Remarks
  status: "pending", // default
  remarks: "",
};

const KycCreate = () => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
        [`${name}_url`]: file ? URL.createObjectURL(file) : null, // 🔥 for preview
      }));
    } else {
      const val =
        name === "is_passport" || name === "is_identification_card" || name === "is_associate_profession"
          ? Number(value)
          : value;

      setFormData((prev) => ({
        ...prev,
        [name]: val,
      }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value);
      }
    });

    try {
      setLoading(true);
      setErrors({});

      const response = await api.post("/kyc", form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const status = response.status;
      const kycData = response.data.data;

      if (status === 200) {
        navigate(`/member/kyc/${kycData.id}`);
      } else if (status === 201) {
        sessionStorage.setItem("kyc_success", "KYC submitted successfully.");
        navigate(`/member/kyc/${kycData.id}`);
      } else {
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || err.response.data.data || {} );
      } else {
        console.error("KYC submit error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KYCForm
      formData={formData}
      onChange={handleChange}
      onFileChange={handleChange}
      onCheckboxChange={handleChange}
      onSubmit={handleSubmit}
      isEdit={false}
      loading={loading}
      errors={errors}
    />
  );
};

export default KycCreate;
