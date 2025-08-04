import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api, { csrf } from "../../../../api/axios";
import useConfirmDialog from "../../../../components/useConfirmDialog";
import "../../../../css/backend/admin/ParentData/index.css";

const Municipality = () => {
    const [municipalities, setMunicipalities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const confirm = useConfirmDialog();

    const fetchMunicipalities = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            await csrf();

            const { data } = await api.get("/parent-data/municipality");

            const items = data?.data;
            if (Array.isArray(items)) {
                setMunicipalities(items);
            } else {
                throw new Error(
                    "Unexpected data format received from the server."
                );
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setMunicipalities([]);
            setError(
                err.response?.data?.message ??
                    err.message ??
                    "Failed to fetch Municipality."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMunicipalities();
    }, [fetchMunicipalities]);

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
                await api.delete(`/parent-data/municipality/${id}`);
                fetchMunicipalities();
            } catch (err) {
                alert("Failed to delete Municipality.");
                console.error(err);
            }
        }
    };

    return (
        <div className="index-page">
            <header className="page-header">
                <h2>Municipality List</h2>
                <div className="header-action">
                    <Link to="/admin/parent-data/municipality/create" className="btn btn-primary">
                        + Add New
                    </Link>
                    <Link to="/admin/parent-data/municipality/trash" className="btn btn-danger">
                        Trash
                    </Link>
                </div>
            </header>

            {loading && <p className="loading-text">Loading Municipality...</p>}

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
                        {municipalities.length ? (
                            municipalities.map((municipality, index) => (
                                <tr key={municipality.id}>
                                    <td>{index + 1}</td>
                                    <td>{municipality.title}</td>
                                    <td>
                                       <span className={`status-badge ${municipality.status == 1 ? 'active' : 'inactive'}`}>
                                        {municipality.status == 1 ? 'Active' : 'Inactive'}
                                      </span>
                                    </td>
                                    <td>{municipality.createdBy?.name?? "-"}</td>
                                    <td>
                                        <Link
                                            to={`/admin/parent-data/municipality/${municipality.id}`} className="btn btn-sm btn-info">show</Link>
                                        <Link to={`/admin/parent-data/municipality/${municipality.id}/edit`} className="btn btn-sm btn-warning">Edit</Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(municipality.id)
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
                                    No municipalities found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Municipality;
