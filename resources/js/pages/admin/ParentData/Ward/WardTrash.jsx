import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api, { csrf } from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import useConfirmDialog from "../../../../components/useConfirmDialog";
import "../../../../css/backend/admin/ParentData/index.css";

const WardTrash = () => {
  const [trashedWard, setTrashedWard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const confirm = useConfirmDialog();

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await csrf();
      const { data } = await api.get("/parent-data/ward/trash");
      const items = data?.data;
      if (Array.isArray(items)) {
        setTrashedWard(items);
      } else {
        throw new Error("Unexpected data format received.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch trash data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrashed();
  }, [fetchTrashed]);

  const handleRestore = async (id) => {
    const result = await confirm({
        title: "Are you want to sure restore?",
        text: "This action cannot be undone.",
        icon: "warning",
        confirmText: "Yes, restore",
    });
    if(result.isConfirmed){
        try {
        await csrf();
        await api.post(`/parent-data/ward/${id}/restore`);
        navigate("/admin/parent-data/ward");
        } catch (err) {
        console.error(err);
        }
    }
  };

  const handleForceDelete = async (id) => {
    const result = await confirm({
        title: "Are you want to sure delete permanently?",
        text: "This action cannot be undone.",
        icon: "warning",
        confirmText: "Yes, delete",
    });
    if(result.isConfirmed){
        try {
        await csrf();
        await api.delete(`/parent-data/ward/${id}/force-delete`);
        fetchTrashed();
        } catch (err) {
        console.error(err);
        }
    }
  };

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <header className="page-header">
        <h2>Trashed Ward</h2>
        <Link to="/admin/parent-data/ward" className="btn btn-secondary bg-gray-600 text-white px-4 py-2 rounded">
        Back to Index
        </Link>
      </header>

      {loading && <p className="loading-text">Loading trashed ward...</p>}

      {!loading && error && <p className="error-text text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Deleted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trashedWard.length > 0 ? (
              trashedWard.map((ward, index) => (
                <tr key={ward.id}>
                  <td>{index + 1}</td>
                  <td>{ward.title}</td>
                  <td>
                    <span
                      className={`status-badge ${ward.status === 1 ? "active" : "inactive"}`}
                    >
                      {ward.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{ward.createdBy?.name || "-"}</td>
                  <td>
                    {new Date(ward.deleted_at).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td>
                    <button onClick={() => handleRestore(ward.id)} className="btn btn-sm btn-success mr-2">
                      Restore
                    </button>
                    <button onClick={() => handleForceDelete(ward.id)} className="btn btn-sm btn-danger">
                      Delete Permanently
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No trashed ward found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WardTrash;
