import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUploadsModule } from "../../hooks/useUploadsModule";

function UploadDocuments() {
  const navigate = useNavigate();

  const { stats, candidates, activeFilter, loadCandidatesByStatus } =
    useUploadsModule();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const filteredCandidates = candidates.filter((candidate) =>
    candidate.full_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const displayedCandidates = showAll
    ? filteredCandidates
    : filteredCandidates.slice(0, 10);
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
        <div className="grid grid-cols-3 gap-6">
          <div
            onClick={() => loadCandidatesByStatus("ALL")}
            className={`bg-white rounded-3xl border shadow-sm p-6 cursor-pointer ${
              activeFilter === "ALL" ? "border-indigo-500" : "border-gray-100"
            }`}
          >
            <p className="text-gray-500">Total in Upload Phase</p>
            <h2 className="text-5xl font-bold text-gray-900 mt-4">
              {stats.total || 0}
            </h2>
          </div>

          <div
            onClick={() => loadCandidatesByStatus("UPLOAD_COMPLETE")}
            className={`bg-white rounded-3xl border shadow-sm p-6 cursor-pointer ${
              activeFilter === "UPLOAD_COMPLETE"
                ? "border-green-500"
                : "border-gray-100"
            }`}
          >
            <p className="text-gray-500">Upload Complete</p>
            <h2 className="text-5xl font-bold text-green-500 mt-4">
              {stats.uploadComplete || 0}
            </h2>
          </div>

          <div
            onClick={() => loadCandidatesByStatus("AWAITING_UPLOAD")}
            className={`bg-white rounded-3xl border shadow-sm p-6 cursor-pointer ${
              activeFilter === "AWAITING_UPLOAD"
                ? "border-yellow-500"
                : "border-gray-100"
            }`}
          >
            <p className="text-gray-500">Awaiting Upload</p>
            <h2 className="text-5xl font-bold text-yellow-500 mt-4">
              {stats.awaitingUpload || 0}
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div
          className="
    sticky
    top-4
    z-30
    bg-white
    rounded-3xl
    border
    border-gray-100
    shadow-sm
    p-6
  "
        >
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
          <div className="overflow-auto max-h-[650px]">
            <table className="w-full min-w-[900px]">
              <thead className="sticky top-0 z-20 bg-[#F8FAFC]">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-semibold">
                    Candidate
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold">
                    Phone
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
                  displayedCandidates.map((candidate) => {
                    const hasUploaded =
                      candidate.status === "DOCUMENTS_UPLOADED" ||
                      candidate.status === "UNDER_VERIFICATION";

                    return (
                      <tr
                        key={candidate.id}
                        className="border-t border-gray-100 hover:bg-[#FAFBFF] transition-all"
                      >
                        {/* Candidate Details */}
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#5B5FEF] text-white flex items-center justify-center font-bold">
                              {candidate.full_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {candidate.full_name}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {candidate.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-6 text-gray-700">{candidate.phone}</td>

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
                            {candidate.status === "REQUEST_SENT" ? (
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
                      No candidates are currently in the document upload phase.
                      Go to the Candidates page to send a request.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredCandidates.length > 10 && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="
        flex
        items-center
        gap-1
        text-sm
        font-semibold
        text-indigo-600
        hover:text-indigo-800
        transition-colors
      "
                >
                  {showAll
                    ? "Show Less"
                    : `View All (${filteredCandidates.length})`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UploadDocuments;
