import React from "react";
import Select from 'react-select';
import "../../../../../css/backend/admin/ParentData/create_form.css";

const MainForm = ({ formData, handleChange, handleSubmit, isEdit = false, loading = false, errors = {}, municipalities = [] }) => {
  const municipalityOptions = municipalities.map((municipality) => ({
    value: municipality.id,
    label: municipality.title,
  }));

  const handleMunicipalityChange = (selectedOption) => {
    handleChange({
      target: {
        name: "municipality_id",
        value: selectedOption ? selectedOption.value : "",
      },
    });
  };
  return (
    <form className="main-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="municipality_id">
          Municipality <span className="required">*</span>
        </label>
        <Select
          id="municipality_id"
          name="municipality_id"
          options={municipalityOptions}
          value={municipalityOptions.find(
            (opt) => opt.value === formData.municipality_id
          )}
          onChange={handleMunicipalityChange}
          placeholder="-- Select Municipality --"
          classNamePrefix={errors.municipality_id ? "input-error" : "react-select"}
        />
        {errors.municipality_id && (
          <span className="error-text">{errors.municipality_id}</span>
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
