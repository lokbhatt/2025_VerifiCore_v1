import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api, { csrf } from "../../../../api/axios";
import useConfirmDialog from "../../../../components/useConfirmDialog";
import "../../../../css/backend/admin/ParentData/index.css";

const Gender = () => {
    const [gender, setGender] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const confirm = useConfirmDialog();

    const fetchGender = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            await csrf();

            const { data } = await api.get("/parent-data/gender");

            const items = data?.data;
            if (Array.isArray(items)) {
                setGender(items);
            } else {
                throw new Error(
                    "Unexpected data format received from the server."
                );
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setGender([]);
            setError(
                err.response?.data?.message ??
                    err.message ??
                    "Failed to fetch gender."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGender();
    }, [fetchGender]);

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
                await api.delete(`/parent-data/gender/${id}`);
                fetchGender();
            } catch (err) {
                alert("Failed to delete gender.");
                console.error(err);
            }
        }
    };

    return (
        <div className="index-page">
            <header className="page-header">
                <h2>Gender List</h2>
                <div className="header-action">
                    <Link to="/admin/parent-data/gender/create" className="btn btn-primary">
                        + Add New
                    </Link>
                    <Link to="/admin/parent-data/gender/trash" className="btn btn-danger">
                        Trash
                    </Link>
                </div>
            </header>

            {loading && <p className="loading-text">Loading gender...</p>}

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
                        {gender.length ? (
                            gender.map((gender, index) => (
                                <tr key={gender.id}>
                                    <td>{index + 1}</td>
                                    <td>{gender.title}</td>
                                    <td>
                                       <span className={`status-badge ${gender.status == 1 ? 'active' : 'inactive'}`}>
                                        {gender.status == 1 ? 'Active' : 'Inactive'}
                                      </span>
                                    </td>
                                    <td>{gender.createdBy?.name?? "-"}</td>
                                    <td>
                                        <Link
                                            to={`/admin/parent-data/gender/${gender.id}`} className="btn btn-sm btn-info">show</Link>
                                        <Link to={`/admin/parent-data/gender/${gender.id}/edit`} className="btn btn-sm btn-warning">Edit</Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(gender.id)
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
                                    No gender found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Gender;
