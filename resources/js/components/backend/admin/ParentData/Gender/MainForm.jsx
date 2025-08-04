import React from "react";
import "../../../../../css/backend/admin/ParentData/create_form.css";

const MainForm = ({ formData, handleChange, handleSubmit, isEdit = false, loading = false, errors = {} }) => {
  return (
    <form className="main-form" onSubmit={handleSubmit}>
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
