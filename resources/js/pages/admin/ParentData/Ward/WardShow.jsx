import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../../../api/axios";

const WardShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ward, setWard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWard = async () => {
    try {
      const res = await api.get(`/parent-data/ward/${id}`);

      const data = res.data?.data ?? res.data;
      setWard(data);
    } catch (err) {
      console.error("Failed to fetch ward:", err);
      setError("Failed to load ward.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWard();
  }, [id]);

  if (loading) return <p>Loading ward...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!ward) return <p>No ward found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Ward Details</h2>
        <div className="flex gap-2">
          <Link to="/admin/parent-data/ward/create" className="btn btn-primary bg-green-600 text-white px-4 py-2 rounded">
            + Add New
          </Link>
          <Link to="/admin/parent-data/ward" className="btn btn-secondary bg-gray-600 text-white px-4 py-2 rounded">
            Back to Index
          </Link>
        </div>
      </header>

      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2 border border-gray-300 w-1/3">Attribute</th>
              <th className="text-left px-4 py-2 border border-gray-300">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Title</td>
              <td className="px-4 py-2 border border-gray-300">{ward.title}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Key</td>
              <td className="px-4 py-2 border border-gray-300">{ward.key}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Municipality</td>
              <td className="px-4 py-2 border border-gray-300">{ward.municipality?.title}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Status</td>
              <td className="px-4 py-2 border border-gray-300">
                <button className={`text-sm px-3 py-1 rounded-full font-semibold transition duration-200 ${ward.status ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`} disabled>
                  {ward.status ? "Active" : "Inactive"}
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Created By</td>
              <td className="px-4 py-2 border border-gray-300">{ward.createdBy?.name ?? "-"}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Updated By</td>
              <td className="px-4 py-2 border border-gray-300">{ward.updatedBy?.name ?? "Not modified till now"}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Created At</td>
              <td className="px-4 py-2 border border-gray-300">{new Date(ward.created_at).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Updated At</td>
              <td className="px-4 py-2 border border-gray-300">{ward.updatedBy ? new Date(ward.updated_at).toLocaleString() : 'Not modified till now'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WardShow;
