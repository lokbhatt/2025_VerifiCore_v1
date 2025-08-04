import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api, { csrf } from "../../../../api/axios";
import useConfirmDialog from "../../../../components/useConfirmDialog";
import "../../../../css/backend/admin/ParentData/index.css";

const Ward = () => {
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const confirm = useConfirmDialog();

    const fetchWards = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            await csrf();

            const { data } = await api.get("/parent-data/ward");

            const items = data?.data;
            if (Array.isArray(items)) {
                setWards(items);
            } else {
                throw new Error(
                    "Unexpected data format received from the server."
                );
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setWards([]);
            setError(
                err.response?.data?.message ??
                    err.message ??
                    "Failed to fetch wards."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWards();
    }, [fetchWards]);

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
                await api.delete(`/parent-data/ward/${id}`);
                fetchWards();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="index-page">
            <header className="page-header">
                <h2>Ward List</h2>
                <div className="header-action">
                    <Link to="/admin/parent-data/ward/create" className="btn btn-primary">
                        + Add New
                    </Link>
                    <Link to="/admin/parent-data/ward/trash" className="btn btn-danger">
                        Trash
                    </Link>
                </div>
            </header>

            {loading && <p className="loading-text">Loading ward...</p>}

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
                        {wards.length ? (
                            wards.map((ward, index) => (
                                <tr key={ward.id}>
                                    <td>{index + 1}</td>
                                    <td>{ward.title}</td>
                                    <td>
                                       <span className={`status-badge ${ward.status == 1 ? 'active' : 'inactive'}`}>
                                        {ward.status == 1 ? 'Active' : 'Inactive'}
                                      </span>
                                    </td>
                                    <td>{ward.createdBy?.name?? "-"}</td>
                                    <td>
                                        <Link
                                            to={`/admin/parent-data/ward/${ward.id}`} className="btn btn-sm btn-info">show</Link>
                                        <Link to={`/admin/parent-data/ward/${ward.id}/edit`} className="btn btn-sm btn-warning">Edit</Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(ward.id)
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
                                    No wards found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Ward;
