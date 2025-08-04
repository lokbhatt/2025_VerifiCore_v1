import React, { useEffect, useRef, useState } from "react";
import ReactSelectWrapper from "../../ReactSelectWrapper";
import api from "../../../api/axios";
import css from "../../../css/backend/member/KycForm.module.scss";
import { Link } from "react-router-dom";

const KYCForm = ({ formData, onChange, onFileChange, errors, onCheckboxChange, onSubmit, isEdit = false, loading }) => {
  const [options, setOptions] = useState({
    districts: [],
    municipalities: [],
    wards: [],
    genders: [],
  });

  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);

  const [tempMunicipalities, setTempMunicipalities] = useState([]);
  const [tempWards, setTempWards] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [districts, municipalities, wards, genders] = await Promise.all([
          api.get("/parent-data/districts"),
          api.get("/parent-data/municipality"),
          api.get("/parent-data/ward"),
          api.get("/parent-data/gender"),
        ]);
        setOptions({
          districts: districts.data?.data || [],
          municipalities: municipalities.data?.data || [],
          wards: wards.data?.data || [],
          genders: genders.data?.data || [],
        });
      } catch (err) {
        console.error("Failed to fetch dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  // Dependent dropdown: Permanent Municipality
  const firstLoad= useRef(true);
  useEffect(() => {
    const fetchMunicipalities = async () => {
      if (formData.district_id) {
        const res = await api.get(`/parent-data/municipality?district_id=${formData.district_id}`);
        setFilteredMunicipalities(res.data.data || []);
        // Reset municipality and ward
        if (!firstLoad.current) {
            onChange({ target: { name: "municipality_id", value: "" } });
            onChange({ target: { name: "ward_id", value: "" } });
        }
        setFilteredWards([]);
      }
    };
    fetchMunicipalities();
  }, [formData.district_id]);
  useEffect(() => {
    if (!formData.district_id) {
        setFilteredMunicipalities([]);
        setFilteredWards([]);
        onChange({ target: { name: "municipality_id", value: "" } });
        onChange({ target: { name: "ward_id", value: "" } });
    }
  }, [formData.district_id]);

  // Dependent dropdown: Permanent Ward
  useEffect(() => {
    const fetchWards = async () => {
      if (formData.municipality_id) {
        const res = await api.get(`/parent-data/ward?municipality_id=${formData.municipality_id}`);
        setFilteredWards(res.data.data || []);
        if(!firstLoad.current){
            onChange({ target: { name: "ward_id", value: "" } });
        }
      }
    };
    fetchWards();
  }, [formData.municipality_id]);
  //  Separate effect: clear wards only when municipality_id is cleared
    useEffect(() => {
    if (!formData.municipality_id) {
        setFilteredWards([]);
        onChange({ target: { name: "ward_id", value: "" } });
    }
    }, [formData.municipality_id]);

  // Dependent dropdown: Temporary Municipality
  useEffect(() => {
    const fetchTempMunicipalities = async () => {
      if (formData.temp_district_id) {
        const res = await api.get(`/parent-data/municipality?district_id=${formData.temp_district_id}`);
        setTempMunicipalities(res.data.data || []);
        if(!firstLoad.current){
            onChange({ target: { name: "temp_municipality_id", value: "" } });
            onChange({ target: { name: "temp_ward_id", value: "" } });
        }
        setTempWards([]);
      }
    };
    fetchTempMunicipalities();
  }, [formData.temp_district_id]);
  useEffect(() => {
    if (!formData.temp_district_id) {
        setTempMunicipalities([]);
        setTempWards([]);
        onChange({ target: { name: "temp_municipality_id", value: "" } });
        onChange({ target: { name: "temp_ward_id", value: "" } });
    }
  }, [formData.temp_district_id]);

  // Dependent dropdown: Temporary Ward
  useEffect(() => {
    const fetchTempWards = async () => {
      if (formData.temp_municipality_id) {
        const res = await api.get(`/parent-data/ward?municipality_id=${formData.temp_municipality_id}`);
        setTempWards(res.data.data || []);
        if(!firstLoad.current){
            onChange({ target: { name: "temp_ward_id", value: "" } });
        }
      }
    };
    fetchTempWards();
  }, [formData.temp_municipality_id]);
  useEffect(() => {
    if (!formData.temp_municipality_id) {
        setTempWards([]);
        onChange({ target: { name: "temp_ward_id", value: "" } });
    }
    }, [formData.temp_municipality_id]);

    const formatCitizenshipNumber = (value) => {
  // Remove non-digit characters
  const digits = value.replace(/\D/g, "").slice(0, 11);

  // Insert dashes
  const formatted = digits.replace(
    /(\d{2})(\d{2})?(\d{2})?(\d{0,5})?/,
        (_, g1, g2, g3, g4) => {
        let result = g1;
        if (g2) result += `-${g2}`;
        if (g3) result += `-${g3}`;
        if (g4) result += `-${g4}`;
        return result;
        }
    );

    return formatted;
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "citizenship_number") {
            const formatted = formatCitizenshipNumber(value);
            onChange({ target: { name, value: formatted } });
        } else {
            onChange(e);
        }
    };

  return (
    <ReactSelectWrapper>
        <form onSubmit={onSubmit} className={css.kycForm}>
        <div className="flex flex-row justify-between items-center">
            <h2>{isEdit ? "Edit KYC" : "New KYC Application"}</h2>
            <Link to={`/member/kyc`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-xl">Index</Link>
        </div>

        {/* 0. Citizenship */}
        <fieldset className={css.fieldset}>
            <legend>Citizenship Information</legend>
            <div className={css.row}>
                <div>
                    <label>Photo Front</label>
                    <input
                        type="file"
                        name="citizenship_photo_front"
                        accept="image/*"
                        onChange={onFileChange}
                    />
                    {errors?.citizenship_photo_front && (
                        <div className="text-red-600 text-sm mt-1">{errors.citizenship_photo_front[0]}</div>
                    )}
                    {formData?.citizenship_photo_front_url && (
                        <div style={{ marginTop: "5px" }}>
                            <img
                                src={formData.citizenship_photo_front_url}
                                alt="Citizenship Front"
                                style={{ width: "100%", height: "auto", borderRadius: "5px" }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label>Photo Back</label>
                    <input
                        type="file"
                        name="citizenship_photo_back"
                        accept="image/*"
                        onChange={onFileChange}
                    />
                    {errors?.citizenship_photo_back && (
                        <div className="text-red-600 text-sm mt-1">{errors.citizenship_photo_back[0]}</div>
                    )}
                    {formData?.citizenship_photo_back_url && (
                        <div style={{ marginTop: "5px" }}>
                            <img
                                src={formData.citizenship_photo_back_url}
                                alt="Citizenship Back"
                                style={{ width: "100%", height: "auto", borderRadius: "5px" }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label>Number</label>
                    <input name="citizenship_number"  value={formData?.citizenship_number || ""} onChange={handleInputChange} placeholder="Please Enter Citizenship Number" />
                    {errors?.citizenship_number && (
                        <div className="text-red-600 text-sm mt-1">{errors.citizenship_number[0]}</div>
                    )}
                </div>
                <div>
                    <label>Issued By</label>
                    <input name="citizenship_issued_by" value={formData?.citizenship_issued_by || ""} onChange={onChange} placeholder="Please enter Issued By Name" />
                    {errors?.citizenship_issued_by && (
                        <div className="text-red-600 text-sm mt-1">{errors.citizenship_issued_by[0]}</div>
                    )}
                </div>
                <div>
                    <label>Issued Date</label>
                    <input type="date" name="citizenship_issued_date" value={formData?.citizenship_issued_date || ""} onChange={onChange} placeholder="Please Enter Issued Date" />
                    {errors?.citizenship_issued_date && (
                        <div className="text-red-600 text-sm mt-1">{errors.citizenship_issued_date[0]}</div>
                    )}
                </div>
                <div>
                    <label>Issued Place</label>
                    <select className="react-select" name="citizenship_issued_place" value={formData?.citizenship_issued_place || ""} onChange={onChange}>
                        <option value="">--Select Issued District--</option>
                        {options.districts.map((district) => (
                            <option key={district.id} value={district.id}>
                            {district.title}
                            </option>
                        ))}
                    </select>
                    {errors?.citizenship_issued_place && (
                        <div className="text-red-600 text-sm mt-1">{errors.citizenship_issued_place[0]}</div>
                    )}
                </div>                
            </div>
        </fieldset>

        {/* 1. Personal Information */}
        <fieldset className={css.fieldset}>
            <legend>Personal Information</legend>
            <div className={css.row}>
                <div>
                    <label>Full Name</label>
                    <input name="name" value={formData?.name || ""} onChange={onChange} placeholder="Please Enter Full Name" />
                 {errors?.name && (
                    <div className="text-red-600 text-sm mt-1">{errors.name[0]}</div>
                 )}
                </div>
                <div>
                    <label>Date of Birth</label>
                    <input type="date" name="dob" value={formData?.dob || ""} onChange={onChange} />
                    {errors?.dob && (
                        <div className="text-red-600 text-sm mt-1">{errors.dob[0]}</div>
                    )}
                </div>
                <div>
                    <label>Gender</label>
                    <select className="react-select" name="gender_id" value={formData?.gender_id || ""} onChange={onChange}>
                        <option value="">--Select Gender--</option>
                        {options.genders.map((gender) => (
                            <option key={gender.id} value={gender.id}>
                            {gender.title}
                            </option>
                        ))}
                    </select>
                    {errors?.gender_id && (
                        <div className="text-red-600 text-sm mt-1">{errors.gender_id[0]}</div>
                    )}
                </div>
                <div>
                    <label>Marital Status</label>
                    <select className="react-select" name="marital_status" value={formData?.marital_status || ""} onChange={onChange}>
                        <option value="">--Select Marital Status--</option>
                        {["single", "married", "divorced", "widowed"].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    {errors?.marital_status && (
                        <div className="text-red-600 text-sm mt-1">{errors.marital_status[0]}</div>
                    )}
                </div>
                <div>
                    <label>Nationality</label>
                    <input name="nationality" value={formData?.nationality || ""} onChange={onChange} placeholder="Please Enter Nationality" />
                    {errors?.nationality && (
                        <div className="text-red-600 text-sm mt-1">{errors.nationality[0]}</div>
                    )}
                </div>
            </div>
        </fieldset>

        {/* 2. Permanent Address */}
        <fieldset className={css.fieldset}>
            <legend>Permanent Address</legend>
            <div className={css.row}>
                <div>
                    <label>District</label>
                    <select className="react-select" name="district_id" value={formData?.district_id || ""} onChange={onChange}>
                        <option value="">--Select District--</option>
                        {options.districts.map((district) => (
                            <option key={district.id} value={district.id}>
                            {district.title}
                            </option>
                        ))}
                    </select>
                    {errors?.district_id && (
                        <div className="text-red-600 text-sm mt-1">{errors.district_id[0]}</div>
                    )}
                </div>
                <div>
                    <label>Municipality</label>
                    <select className="react-select" name="municipality_id" value={formData?.municipality_id || ""} onChange={onChange}>
                        <option value="">--Select Municipality--</option>
                        {filteredMunicipalities.map((municipality) => (
                            <option key={municipality.id} value={municipality.id}>
                            {municipality.title}
                            </option>
                        ))}
                    </select>
                    {errors?.municipality_id && (
                        <div className="text-red-600 text-sm mt-1">{errors.municipality_id[0]}</div>
                    )}
                </div>
                <div>
                    <label>Ward</label>
                    <select className="react-select" name="ward_id" value={formData?.ward_id || ""} onChange={onChange}>
                        <option value="">--Select Ward--</option>
                        {filteredWards.map((ward) => (
                            <option key={ward.id} value={ward.id}>
                            {ward.title}
                            </option>
                        ))}
                    </select>
                    {errors?.ward_id && (
                        <div className="text-red-600 text-sm mt-1">{errors?.ward_id[0]}</div>
                    )}
                </div>
                <div>
                    <label>Tole</label>
                    <input name="tole" value={formData?.tole || ""} onChange={onChange} placeholder="Please Enter Tole" />
                </div>
                <div>
                    <label>House No.</label>
                    <input name="house_number" value={formData?.house_number || ""} onChange={onChange} placeholder="Please Enter House Number" />
                </div>
            </div>
        </fieldset>

        {/* 3. Temporary Address */}
        <fieldset className={css.fieldset}>
            <legend>Temporary Address</legend>
            <div className={css.row}>
                <div>
                    <label>District</label>
                    <select className="react-select" name="temp_district_id" value={formData?.temp_district_id || ""} onChange={onChange}>
                        <option value="">--Select Temporary District--</option>
                        {options.districts.map((district) => (
                            <option key={district.id} value={district.id}>
                            {district.title}
                            </option>
                        ))}
                    </select>
                    {errors?.temp_district_id && (
                        <div className="text-red-600 text-sm mt-1">{errors?.temp_district_id[0]}</div>
                    )}
                </div>
                <div>
                    <label>Municipality</label>
                    <select className="react-select" name="temp_municipality_id" value={formData?.temp_municipality_id || ""} onChange={onChange}>
                        <option value="">--Select Temporary Municipality--</option>
                        {tempMunicipalities.map((municipality) => (
                            <option key={municipality.id} value={municipality.id}>
                            {municipality.title}
                            </option>
                        ))}
                    </select>
                    {errors?.temp_municipality_id && (
                        <div className="text-red-600 text-sm mt-1">{errors?.temp_municipality_id[0]}</div>
                    )}
                </div>
                <div>
                    <label>Ward</label>
                    <select className="react-select" name="temp_ward_id" value={formData?.temp_ward_id || ""} onChange={onChange}>
                        <option value="">--Select Temporary Ward--</option>
                        {tempWards.map((ward) => (
                            <option key={ward.id} value={ward.id}>
                            {ward.title}
                            </option>
                        ))}
                    </select>
                    {errors?.temp_ward_id && (
                        <div className="text-red-600 text-sm mt-1">{errors?.temp_ward_id[0]}</div>
                    )}
                </div>
                <div>
                    <label>Tole</label>
                    <input name="temp_tole" value={formData?.temp_tole || ""} onChange={onChange} placeholder="Please Enter Temporary Tole" />
                </div>
                <div>
                    <label>House No.</label>
                    <input name="temp_house_number" value={formData?.temp_house_number || ""} onChange={onChange} placeholder="Please Enter Temporary House Number" />
                </div>
            </div>
        </fieldset>

        {/* 4. Contact Info */}
        <fieldset className={css.fieldset}>
            <legend>Contact Information</legend>
            <div className={css.row}>
                <div><label>Email</label><input name="email" value={formData?.email || ""} onChange={onChange} placeholder="Please Enter Email" />
                    {errors?.email && (
                        <div className="text-red-600 text-sm mt-1">{errors?.email[0]}</div>
                    )}
                </div>
                <div><label>Phone</label><input name="phone" value={formData?.phone || ""} onChange={onChange} placeholder="Please Enter Phone" />
                    {errors?.phone && (
                        <div className="text-red-600 text-sm mt-1">{errors?.phone[0]}</div>
                    )}
                </div>
                <div><label>Landline</label><input name="landline" value={formData?.landline || ""} onChange={onChange} placeholder="Please Enter landline Number" /></div>
            </div>
        </fieldset>

        {/* 5. Family Info */}
        <fieldset className={css.fieldset}>
            <legend>Family Information</legend>
            <div className={css.row}>
                <div><label>Father</label><input name="father" value={formData?.father || ""} onChange={onChange} placeholder="Please Enter Father Name" />
                    {errors?.father && (
                        <div className="text-red-600 text-sm mt-1">{errors?.father[0]}</div>
                    )}
                </div>
                <div><label>Mother</label><input name="mother" value={formData?.mother || ""} onChange={onChange} placeholder="Please Enter Mother Name" /></div>
                <div><label>Grandfather</label><input name="grandfather" value={formData?.grandfather || ""} onChange={onChange} placeholder="Please Enter Grandfather Name" />
                    {errors?.grandfather && (
                        <div className="text-red-600 text-sm mt-1">{errors?.grandfather[0]}</div>
                    )}
                </div>
                <div><label>Spouse</label><input name="spouse" value={formData?.spouse || ""} onChange={onChange} placeholder="Please Enter Spouse Name" /></div>
            </div>
        </fieldset>

        <div className="flex gap-8 mb-4">
            <label htmlFor="is_passport">Do you have a passport?</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-1">
                    <input type="radio" name="is_passport" value="1" checked={formData?.is_passport === 1} onChange={() =>onChange({ target: { name: "is_passport", value: 1 } })} />
                    Yes
                </label>
                <label className="flex items-center gap-1">
                    <input type="radio" name="is_passport"  value="0" checked={formData?.is_passport === 0} onChange={() => onChange({ target: { name: "is_passport", value: 0 } })} />
                    No
                </label>
            </div>
            {errors?.is_passport && (
                <div className="text-red-600 text-sm mt-1">{errors?.is_passport[0]}</div>
            )}
        </div>

        <fieldset className={`${css.fieldset} ${ !formData?.is_passport ? css.hidden : "" }`}>
            <legend>Passport Information</legend>
            <div className={css.row}>
                <div>
                    <label>Number</label>
                    <input name="passport_number" value={formData?.passport_number || ""} onChange={onChange} placeholder="Please Enter Passport Number" />
                     {errors?.passport_number && (
                        <div className="text-red-600 text-sm mt-1">{errors?.passport_number[0]}</div>
                    )}
                </div>
                <div>
                    <label>Issued By</label>
                    <input name="passport_issued_by" value={formData?.passport_issued_by || ""} onChange={onChange} placeholder="Please Enter Password Issued By" />
                     {errors?.passport_issued_by && (
                        <div className="text-red-600 text-sm mt-1">{errors?.passport_issued_by[0]}</div>
                    )}
                </div>
                <div>
                    <label>Issued Date</label>
                    <input type="date" name="passport_issued_date" value={formData?.passport_issued_date || ""} onChange={onChange} />
                         {errors?.passport_issued_date && (
                        <div className="text-red-600 text-sm mt-1">{errors?.passport_issued_date[0]}</div>
                    )}
                </div>
                <div>
                    <label>Expire Date</label>
                    <input type="date" name="passport_expire_date" value={formData?.passport_expire_date || ""} onChange={onChange} />
                    {errors?.passport_expire_date && (
                        <div className="text-red-600 text-sm mt-1">{errors?.passport_expire_date[0]}</div>
                    )}
                </div>
            </div>
        </fieldset>

        <div className="flex gap-8 mb-4">
            <label htmlFor="is_identification_card">Do you have a Identification Card?</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-1">
                    <input type="radio" name="is_identification_card" value="1" checked={formData?.is_identification_card === 1} onChange={() =>onChange({ target: { name: "is_identification_card", value: 1 } })} />
                    Yes
                </label>
                <label className="flex items-center gap-1">
                    <input type="radio" name="is_identification_card"  value="0" checked={formData?.is_identification_card === 0} onChange={() => onChange({ target: { name: "is_identification_card", value: 0 } })} />
                    No
                </label>
            </div>
            {errors?.is_identification_card && (
                <div className="text-red-600 text-sm mt-1">{errors?.is_identification_card[0]}</div>
            )}
        </div>

        <fieldset className={`${css.fieldset} ${ !formData?.is_identification_card ? css.hidden : "" }`}>
            <legend>Identification Card Information</legend>
            <div className={css.row}>
                <div>
                    <label>Identification Card Type</label>
                    <select className="react-select" name="identification_card_type" value={formData?.identification_card_type || ""} onChange={onChange}>
                        <option value="">--Select Identification Card Type--</option>
                        {["License", "Voter Card"].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    {errors?.identification_card_type && (
                        <div className="text-red-600 text-sm mt-1">{errors?.identification_card_type[0]}</div>
                    )}
                </div>
                <div>
                    <label>Identification Card Number</label>
                    <input name="identification_card_number" value={formData?.identification_card_number || ""} onChange={onChange} placeholder="Please Enter Identification Card Number" />
                    {errors?.identification_card_number && (
                        <div className="text-red-600 text-sm mt-1">{errors?.identification_card_number[0]}</div>
                    )}
                </div>
                <div>
                    <label>Identification Card Issued Date</label>
                    <input type="date" name="identification_card_issued_date" value={formData?.identification_card_issued_date || ""} onChange={onChange} />
                    {errors?.identification_card_issued_date && (
                        <div className="text-red-600 text-sm mt-1">{errors?.identification_card_issued_date[0]}</div>
                    )}
                </div>
                <div>
                    <label>Identification Card Expire Date</label>
                    <input type="date" name="identification_card_expire_date" value={formData?.identification_card_expire_date || ""} onChange={onChange} />
                    {errors?.identification_card_expire_date && (
                        <div className="text-red-600 text-sm mt-1">{errors?.identification_card_expire_date[0]}</div>
                    )}
                </div>
            </div>
        </fieldset>

        <div className="flex gap-8 mb-4">
            <label htmlFor="is_associate_profession">Do you Involve any Associate Profession?</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-1">
                    <input type="radio" name="is_associate_profession" value="1" checked={formData?.is_associate_profession === 1} onChange={() =>onChange({ target: { name: "is_associate_profession", value: 1 } })} />
                    Yes
                </label>
                <label className="flex items-center gap-1">
                    <input type="radio" name="is_associate_profession"  value="0" checked={formData?.is_associate_profession === 0} onChange={() => onChange({ target: { name: "is_associate_profession", value: 0 } })} />
                    No
                </label>
            </div>
            {errors?.is_associate_profession && (
                <div className="text-red-600 text-sm mt-1">{errors?.is_associate_profession[0]}</div>
            )}
        </div>

        <fieldset className={`${css.fieldset} ${ !formData?.is_associate_profession ? css.hidden : "" }`}>
            <legend>Associate Profession Information</legend>
            <div className={css.row}>
                <div>
                    <label>Organization Name</label>
                    <input name="organization_name" value={formData?.organization_name || ""} onChange={onChange} placeholder="Please Enter Organization Name" />
                    {errors?.organization_name && (
                        <div className="text-red-600 text-sm mt-1">{errors?.organization_name[0]}</div>
                    )}
                </div>
                <div>
                    <label>Organization Address</label>
                    <input name="organization_address" value={formData?.organization_address || ""} onChange={onChange} placeholder="Please Enter Organization Address" />
                    {errors?.organization_address && (
                        <div className="text-red-600 text-sm mt-1">{errors?.organization_address[0]}</div>
                    )}
                </div>
                <div>
                    <label>Organization Contact Number</label>
                    <input type="text" name="organization_contact_number" value={formData?.organization_contact_number || ""} onChange={onChange} placeholder="Please Enter Organization Contact Number"/>
                    {errors?.organization_contact_number && (
                        <div className="text-red-600 text-sm mt-1">{errors?.organization_contact_number[0]}</div>
                    )}
                </div>
                <div>
                    <label>Designation</label>
                    <input type="text" name="designation" value={formData?.designation || ""} onChange={onChange} placeholder="Please Enter Designation" />
                    {errors?.designation && (
                        <div className="text-red-600 text-sm mt-1">{errors?.designation[0]}</div>
                    )}
                </div>
                <div>
                    <label>Estimated Annual Income</label>
                    <input type="text" name="estimated_annual_income" value={formData?.estimated_annual_income || ""} onChange={onChange} placeholder="Please Enter Estimated Annual Income" />
                    {errors?.estimated_annual_income && (
                        <div className="text-red-600 text-sm mt-1">{errors?.estimated_annual_income[0]}</div>
                    )}
                </div>
                <div>
                    <label>Estimated Annual Transaction</label>
                    <input type="text" name="estimated_annual_transaction" value={formData?.estimated_annual_transaction || ""} onChange={onChange} placeholder="Please Enter Designation" />
                    {errors?.estimated_annual_transaction && (
                        <div className="text-red-600 text-sm mt-1">{errors?.estimated_annual_transaction[0]}</div>
                    )}
                </div>
            </div>
        </fieldset>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : isEdit ? "Update" : "Submit"}
        </button>
        </form>
    </ReactSelectWrapper>
  );
};

export default KYCForm;
