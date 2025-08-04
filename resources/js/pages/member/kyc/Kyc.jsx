import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Link } from "react-router-dom";

const KycIndex = () => {
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchKycList = async () => {
    try {
      const response = await api.get("/kyc", { withCredentials: true });
      const fetched = response.data.data;
      setKycList(Array.isArray(fetched) ? fetched : []);
    } catch (error) {
      console.error("Failed to fetch KYC data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycList();
    const successMsg = sessionStorage.getItem("kyc_success");
    if (successMsg) {
      setMessage(successMsg);
      sessionStorage.removeItem("kyc_success");
    }
  }, []);


  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">KYC Application</h2>
        <div className="flex flex-col items-end space-y-2">
          <Link
            to="/member/kyc/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Submitted By</th>
              <th className="px-4 py-2 border">Submitted At</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading ? (
              kycList.map(row => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-2 border">{row.id}</td>
                  <td className="px-4 py-2 border">{row.name}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`font-semibold ${
                        row.status === "approved"
                          ? "text-green-600"
                          : row.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{row.createdBy?.name || "—"}</td>
                  <td className="px-4 py-2 border">
                    {new Date(row.created_at).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex space-x-2">
                      <Link
                        to={`/member/kyc/${row.id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        View
                      </Link>
                      {row.status === "pending" && (
                        <Link
                          to={`/member/kyc/${row.id}/edit`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                  {loading ? "Loading..." : "No matching records found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default KycIndex;
