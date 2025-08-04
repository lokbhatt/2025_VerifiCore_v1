import React, { useEffect, useState } from "react";
import api, { csrf } from "../../../api/axios";
import { Link } from "react-router-dom";
import useConfirmDialog from "../../../components/useConfirmDialog";

const KycIndex = () => {
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchText, setSearchText] = useState("");
  const confirm = useConfirmDialog();

  const fetchKycList = async () => {
    setLoading(true);
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

  const filteredData = kycList.filter((item) =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (id) => {
    const result = await confirm({
      title: "Are you want to sure delete?",
      text: "This action cannot be undone.",
      icon: "warning",
      confirmText: "Yes, delete",
    });
    if (result.isConfirmed) {
      try {
        await csrf();
        await api.delete(`/kyc/${id}`);
        fetchKycList();
      } catch (err) {
        alert("Failed to delete record.");
        console.error(err);
      }
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">KYC Applications</h2>
        <div className="flex flex-col items-end space-y-2">
          <Link
            to="/admin/kyc/trash"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
          >
            Trash
          </Link>
          <input
            type="text"
            placeholder="Search"
            className="border px-2 py-1 rounded w-[150px] h-[40px]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
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
            {!loading && filteredData.length > 0 ? (
              filteredData.map((row) => (
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
                  <td className="px-4 py-2 border">
                    {row.createdBy?.name || "—"}
                  </td>
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
                        to={`/admin/kyc/${row.id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-4 text-center text-gray-500"
                >
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
