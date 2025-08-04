import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api, { csrf } from "../../../../api/axios";
import useConfirmDialog from "../../../../components/useConfirmDialog";
import "../../../../css/backend/admin/ParentData/index.css";

const District = () => {
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const confirm = useConfirmDialog();

    const fetchDistricts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            await csrf();

            const { data } = await api.get("/parent-data/districts");

            const items = data?.data;
            if (Array.isArray(items)) {
                setDistricts(items);
            } else {
                throw new Error(
                    "Unexpected data format received from the server."
                );
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setDistricts([]);
            setError(
                err.response?.data?.message ??
                    err.message ??
                    "Failed to fetch districts."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDistricts();
    }, [fetchDistricts]);

    const handleDelete = async (id) => {
        const result = await confirm({
            title: "Are you want to sure delete?",
            text: "This action cannot be undone.",
            icon: "warning",
            confirmText: "Yes, delete",
        });
        if(result.isConfirmed){
            try {
                await csrf();
                await api.delete(`/parent-data/districts/${id}`);
                fetchDistricts(); // Refresh list
            } catch (err) {
                alert("Failed to delete district.");
                console.error(err);
            }
        }
    };

    return (
        <div className="index-page">
            <header className="page-header">
                <h2>District List</h2>
                <div className="header-action">
                    <Link to="/admin/parent-data/district/create" className="btn btn-primary">
                        + Add New
                    </Link>
                    <Link to="/admin/parent-data/district/trash" className="btn btn-danger">
                        Trash
                    </Link>
                </div>
            </header>

            {loading && <p className="loading-text">Loading districts...</p>}

            {!loading && error && (
                <p className="error-text" style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {!loading && !error && (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {districts.length ? (
                            districts.map((district, index) => (
                                <tr key={district.id}>
                                    <td>{index + 1}</td>
                                    <td>{district.title}</td>
                                    <td>
                                       <span className={`status-badge ${district.status == 1 ? 'active' : 'inactive'}`}>
                                        {district.status == 1 ? 'Active' : 'Inactive'}
                                      </span>
                                    </td>
                                    <td>{district.createdBy?.name?? "-"}</td>
                                    <td>
                                        <Link
                                            to={`/admin/parent-data/district/${district.id}`} className="btn btn-sm btn-info">show</Link>
                                        <Link to={`/admin/parent-data/district/${district.id}/edit`} className="btn btn-sm btn-warning">Edit</Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(district.id)
                                            }
                                            className="btn btn-sm btn-danger"
                                        >
                                            delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    No districts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default District;
