import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../api/axios";

const KycShow = () => {
  const { id } = useParams();
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchKyc = async () => {
    try {
      const res = await api.get(`/kyc/${id}`);
      const data = res.data?.data ?? res.data;
      setKyc(data);
      console.log("KYC response:", data); // ✅ DEBUGGING LINE
    } catch (err) {
      console.error("Failed to fetch KYC:", err);
      setError("Failed to load KYC record.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKyc();
  }, [id]);

  if (loading) return <p>Loading KYC...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!kyc) return <p>No KYC record found.</p>;

  const renderRow = (label, value) => (
    <tr>
      <td className="px-4 py-2 border border-gray-300 font-medium">{label}</td>
      <td className="px-4 py-2 border border-gray-300">{value || "-"}</td>
    </tr>
  );

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  return (
    <div className="kyc-show-page p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">KYC Details</h2>
        <div className="flex gap-2">
          <Link to="/member/kyc/create" className="bg-green-600 text-white px-4 py-2 rounded">
            + Add New
          </Link>
          <Link to="/member/kyc" className="bg-gray-600 text-white px-4 py-2 rounded">
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
            {/* Personal Info */}
            {renderRow("Name", kyc.name)}
            {renderRow("Date of Birth", formatDate(kyc.dob))}
            {renderRow("Gender", kyc.gender.title)}
            {renderRow("Marital Status", kyc.marital_status)}
            {renderRow("Nationality", kyc.nationality)}

            {/* Permanent Address */}
            {renderRow("Permanent District", kyc.district?.title)}
            {renderRow("Permanent Municipality", kyc.municipality?.title)}
            {renderRow("Permanent Ward", kyc.ward?.title)}
            {renderRow("Permanent Tole", kyc.tole)}
            {renderRow("Permanent House Number", kyc.house_number)}

            {/* Temporary Address */}
            {renderRow("Temporary District", kyc.temp_district?.title)}
            {renderRow("Temporary Municipality", kyc.temp_municipality?.title)}
            {renderRow("Temporary Ward", kyc.temp_ward?.title)}
            {renderRow("Temporary Tole", kyc.temp_tole)}
            {renderRow("Temporary House Number", kyc.temp_house_number)}

            {/* Contact */}
            {renderRow("Email", kyc.email)}
            {renderRow("Phone", kyc.phone)}
            {renderRow("Landline", kyc.landline)}

            {/* Family Info */}
            {renderRow("Father's Name", kyc.father)}
            {renderRow("Mother's Name", kyc.mother)}
            {renderRow("Grandfather's Name", kyc.grandfather)}
            {renderRow("Spouse's Name", kyc.spouse)}

            {/* Citizenship */}
            {renderRow("Citizenship Number", kyc.citizenship_number)}
            {renderRow("Issued By", kyc.citizenship_issued_by)}
            {renderRow("Issued Date", formatDate(kyc.citizenship_issued_date))}
            {renderRow("Issued Place", kyc.citizenship_issued_place)}
            {renderRow("Citizenship Front", (
               <img
                src={kyc.citizenship_photo_front}
                alt="Citizenship Front"
                className="w-40 border rounded"
              />
            ))}
            {renderRow("Citizenship Back", (
               <img
                src={kyc.citizenship_photo_back}
                alt="Citizenship back"
                className="w-40 border rounded"
              />
            ))}

            {/* Passport */}
            {renderRow("Has Passport?", kyc.is_passport ? "Yes" : "No")}
            {kyc.is_passport && (
              <>
                {renderRow("Passport Number", kyc.passport_number)}
                {renderRow("Passport Issued By", kyc.passport_issued_by)}
                {renderRow("Passport Issued Date", formatDate(kyc.passport_issued_date))}
                {renderRow("Passport Expiry Date", formatDate(kyc.passport_expire_date))}
              </>
            )}

            {/* ID Card */}
            {renderRow("Has ID Card?", kyc.is_identification_card ? "Yes" : "No")}
            {kyc.is_identification_card && (
              <>
                {renderRow("ID Type", kyc.identification_card_type)}
                {renderRow("ID Number", kyc.identification_card_number)}
                {renderRow("ID Issued Date", formatDate(kyc.identification_card_issued_date))}
                {renderRow("ID Expiry Date", formatDate(kyc.identification_card_expire_date))}
              </>
            )}

            {/* Profession */}
            {renderRow("Has Profession?", kyc.is_associate_profession ? "Yes" : "No")}
            {kyc.is_associate_profession && (
              <>
                {renderRow("Organization Name", kyc.organization_name)}
                {renderRow("Organization Address", kyc.organization_address)}
                {renderRow("Organization Contact", kyc.organization_contact_number)}
                {renderRow("Designation", kyc.designation)}
                {renderRow("Estimated Annual Income", kyc.estimated_annual_income)}
                {renderRow("Estimated Annual Transaction", kyc.estimated_annual_transaction)}
              </>
            )}

            {/* Status */}
            {renderRow("Status", (
              <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                kyc.status === "approved" ? "bg-green-100 text-green-700" :
                kyc.status === "rejected" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {kyc.status}
              </span>
            ))}

            {/* Meta Info */}
            {renderRow("Remarks", kyc.remarks)}
            {renderRow("Created By", kyc.createdBy?.name)}
            {renderRow("Updated By", kyc.updatedBy?.name ?? "Not modified till now")}
            {renderRow("Created At", formatDate(kyc.created_at))}
            {renderRow("Updated At", kyc.updatedBy ? formatDate(kyc.updated_at) : "Not modified till now")}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KycShow;
