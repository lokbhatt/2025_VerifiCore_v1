import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../../../api/axios";

const MunicipalityShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [municipality, setMunicipality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMunicipality = async () => {
    try {
      const res = await api.get(`/parent-data/municipality/${id}`);

      const data = res.data?.data ?? res.data;
      setMunicipality(data);
    } catch (err) {
      console.error("Failed to fetch municipality:", err);
      setError("Failed to load municipality.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMunicipality();
  }, [id]);

  if (loading) return <p>Loading municipality...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!municipality) return <p>No municipality found.</p>;

  return (
    <div className="municipality-show-page p-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">municipality Details</h2>
        <div className="flex gap-2">
          <Link to="/admin/parent-data/municipality/create" className="btn btn-primary bg-green-600 text-white px-4 py-2 rounded">
            + Add New
          </Link>
          <Link to="/admin/parent-data/municipality" className="btn btn-secondary bg-gray-600 text-white px-4 py-2 rounded">
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
              <td className="px-4 py-2 border border-gray-300">{municipality.title}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Key</td>
              <td className="px-4 py-2 border border-gray-300">{municipality.key}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">District</td>
              <td className="px-4 py-2 border border-gray-300">{municipality.district.title}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Status</td>
              <td className="px-4 py-2 border border-gray-300">
                <button className={`text-sm px-3 py-1 rounded-full font-semibold transition duration-200 ${municipality.status ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`} disabled>
                  {municipality.status ? "Active" : "Inactive"}
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Created By</td>
              <td className="px-4 py-2 border border-gray-300">{municipality.createdBy?.name ?? "-"}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Updated By</td>
              <td className="px-4 py-2 border border-gray-300">{municipality.updatedBy?.name ?? "Not modified till now"}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Created At</td>
              <td className="px-4 py-2 border border-gray-300">{new Date(municipality.created_at).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">Updated At</td>
              <td className="px-4 py-2 border border-gray-300">{municipality.updatedBy ? new Date(municipality.updated_at).toLocaleString() : 'Not modified till now'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MunicipalityShow;
