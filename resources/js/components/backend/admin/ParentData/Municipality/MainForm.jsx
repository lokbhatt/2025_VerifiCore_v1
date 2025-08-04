import React from "react";
import Select from "react-select";
import "../../../../../css/backend/admin/ParentData/create_form.css";

const MainForm = ({ formData, handleChange, handleSubmit, isEdit = false, loading = false, errors = {}, districts = [], }) => {
  const districtOptions = districts.map((district) => ({
    value: district.id,
    label: district.title,
  }));

  const handleDistrictChange = (selectedOption) => {
    handleChange({
      target: {
        name: "district_id",
        value: selectedOption ? selectedOption.value : "",
      },
    });
  };
  return (
    <form className="main-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="district_id">
          District <span className="required">*</span>
        </label>
        <Select
          id="district_id"
          name="district_id"
          options={districtOptions}
          value={districtOptions.find(
            (opt) => opt.value === formData.district_id
          )}
          onChange={handleDistrictChange}
          placeholder="-- Select District --"
          classNamePrefix={errors.district_id ? "input-error" : "react-select"}
        />
        {errors.district_id && (
          <span className="error-text">{errors.district_id}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-control ${errors.title ? "input-error" : ""}`}
          placeholder="Enter title"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="key">Key <span className="required">*</span></label>
        <input
          type="text"
          id="key"
          name="key"
          value={formData.key}
          onChange={handleChange}
          className={`form-control ${errors.key ? "input-error" : ""}`}
          placeholder="Enter key"
        />
        {errors.key && <span className="error-text">{errors.key}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="status">
          Status <span className="required">*</span>
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-control"
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default MainForm;
