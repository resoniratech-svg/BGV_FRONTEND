import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Candidate {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
  progress?: number;
}

function UploadDocuments() {
  const navigate = useNavigate();

  // 1. Read the exact same data source as the rest of the application
  const [candidateList] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem("candidates");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState("");

  // 2. Filter logic specifically for the Upload workflow phase
  const uploadCandidates = candidateList.filter(
    (candidate) =>
      candidate.status === "Request Sent" ||
      candidate.status === "Documents Uploaded" ||
      candidate.status === "Under Verification"
  );

  const filteredCandidates = uploadCandidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Document Repository
            </h1>
            <p className="text-gray-500 mt-2">
              Manage uploaded candidate documents
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-500">Total in Upload Phase</p>
            <h2 className="text-5xl font-bold text-gray-900 mt-4">
              {uploadCandidates.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-500">Upload Complete</p>
            <h2 className="text-5xl font-bold text-green-500 mt-4">
              {
                uploadCandidates.filter(
                  (c) =>
                    c.status === "Documents Uploaded" ||
                    c.status === "Under Verification"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-500">Awaiting Upload</p>
            <h2 className="text-5xl font-bold text-yellow-500 mt-4">
              {
                uploadCandidates.filter((c) => c.status === "Request Sent").length
              }
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Search candidate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none w-full max-w-md"
            />
          </div>
        </div>

        {/* Candidate Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="text-left p-6 text-gray-500 font-semibold">
                  Candidate
                </th>
                <th className="text-left p-6 text-gray-500 font-semibold">
                  Role
                </th>
                <th className="text-left p-6 text-gray-500 font-semibold">
                  Upload Status
                </th>
                <th className="text-left p-6 text-gray-500 font-semibold">
                  System Phase
                </th>
                <th className="text-left p-6 text-gray-500 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => {
                  const hasUploaded =
                    candidate.status === "Documents Uploaded" ||
                    candidate.status === "Under Verification";

                  return (
                    <tr
                      key={candidate.id}
                      className="border-t border-gray-100 hover:bg-[#FAFBFF] transition-all"
                    >
                      {/* Candidate Details */}
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#5B5FEF] text-white flex items-center justify-center font-bold">
                            {candidate.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {candidate.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {candidate.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-6 text-gray-700">{candidate.role}</td>

                      {/* Upload Status */}
                      <td className="p-6">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            hasUploaded
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {hasUploaded ? "Complete" : "Pending Candidate"}
                        </span>
                      </td>

                      {/* Overall System Status */}
                      <td className="p-6">
                        <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                          {candidate.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-6">
                        <div className="flex gap-3">
                          {candidate.status === "Request Sent" ? (
                            <button
                              disabled
                              className="bg-gray-200 text-gray-500 cursor-not-allowed px-5 py-2 rounded-xl transition-all font-medium text-sm"
                            >
                              Awaiting Upload
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                navigate(`/uploads/${candidate.id}`)
                              }
                              className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-5 py-2 rounded-xl transition-all font-medium text-sm"
                            >
                              View Documents
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-gray-400">
                    No candidates are currently in the document upload phase. Go to the Candidates page to send a request.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UploadDocuments;