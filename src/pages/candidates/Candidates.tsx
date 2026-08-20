import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, Calendar } from "lucide-react";
import { useCandidatesModule } from "../../hooks/useCandidatesModule";

import {
  deleteCandidateApi,
  generateCandidateLink,
} from "../../api/candidateApi";

function Candidates() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    stats,
    candidates,
    activeFilter,
    loadCandidatesByStatus,
    loadCandidates,
  } = useCandidatesModule();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState("");
  const [showAll, setShowAll] = useState(false);
  // Initial setup loading hook data
  useEffect(() => {
    loadCandidates();
  }, []);

  // Fixes stuck navigation behavior when coming from Dashboard
  useEffect(() => {
    if (
      location.state?.filterType === "COMPLETED_TODAY" &&
      candidates.length > 0
    ) {
      loadCandidatesByStatus("VERIFIED");
      setSelectedDate(location.state.date);
      setStatusFilter("VERIFIED");

      // Clear the location state history within React Router to prevent locking the screen
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    location.state,
    candidates.length,
    navigate,
    location.pathname,
    loadCandidatesByStatus,
  ]);

  // Handle local card clicks to accurately reset conflicting state details
  const handleCardClick = (status: string) => {
    if (status === "ALL") {
      setSelectedDate(""); // Clear out the specific calendar filter date
      setStatusFilter("All Status");
    } else {
      setStatusFilter(status);
    }
    loadCandidatesByStatus(status);
  };

  const deleteCandidate = async (id: number) => {
    // if (confirm("Are you sure you want to remove this candidate?")) {

    // }
    try {
      await deleteCandidateApi(id);
      loadCandidates();
    } catch (error) {
      console.error(error);
    }
  };

  const totalCandidates = stats.total || 0;
  const verifiedCount = stats.verified || 0;
  const pendingCount = stats.pending || 0;
  const fraudCount = stats.fraud || 0;

  // Filter candidates based on search queries and the date filters
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(candidate.id).includes(searchQuery);

    const targetTimestamp =
      activeFilter === "ALL"
        ? candidate.created_at
        : candidate.updated_at || candidate.created_at;

    const filterDate = targetTimestamp
      ? new Date(targetTimestamp).toISOString().split("T")[0]
      : "";

    const matchesDate = !selectedDate || filterDate === selectedDate;

    return matchesSearch && matchesDate;
  });
  const displayedCandidates = showAll
    ? filteredCandidates
    : filteredCandidates.slice(0, 10);

  const sendVerificationRequest = async (candidateId: number) => {
    try {
      await generateCandidateLink(candidateId);
      alert("Verification REQUEST_SENT successfully");
      loadCandidates();
    } catch (error) {
      console.error(error);
      alert("Failed to send verification request");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-4xl font-bold">Candidates</h1>
            <p className="text-gray-500 mt-2">
              Manage candidate verification workflows
            </p>
          </div>

          <button
            onClick={() => navigate("/add-candidate")}
            className="bg-[#5B5FEF] hover:bg-[#4B4FD8] transition-all text-white px-6 py-3 rounded-2xl font-medium shadow-lg"
          >
            + Add Candidate
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div
            onClick={() => handleCardClick("ALL")}
            className={`bg-white rounded-3xl p-6 border shadow-sm cursor-pointer transition-all ${
              activeFilter === "ALL"
                ? "border-[#5B5FEF] ring-2 ring-indigo-100"
                : "border-gray-100"
            }`}
          >
            <p className="text-gray-500 font-medium">Total Candidates</p>
            <h2 className="text-5xl font-bold text-gray-900 mt-4">
              {totalCandidates}
            </h2>
          </div>

          <div
            onClick={() => handleCardClick("VERIFIED")}
            className={`bg-white rounded-3xl p-6 border shadow-sm cursor-pointer transition-all ${
              activeFilter === "VERIFIED"
                ? "border-green-500 ring-2 ring-green-100"
                : "border-gray-100"
            }`}
          >
            <p className="text-gray-500 font-medium">Verified</p>
            <h2 className="text-5xl font-bold text-green-500 mt-4">
              {verifiedCount}
            </h2>
          </div>

          <div
            onClick={() => handleCardClick("PENDING")}
            className={`bg-white rounded-3xl p-6 border shadow-sm cursor-pointer transition-all ${
              activeFilter === "PENDING"
                ? "border-yellow-500 ring-2 ring-yellow-100"
                : "border-gray-100"
            }`}
          >
            <p className="text-gray-500 font-medium">Pending</p>
            <h2 className="text-5xl font-bold text-yellow-500 mt-4">
              {pendingCount}
            </h2>
          </div>

          <div
            onClick={() => handleCardClick("FRAUD_ALERT")}
            className={`bg-white rounded-3xl p-6 border shadow-sm cursor-pointer transition-all ${
              activeFilter === "FRAUD_ALERT"
                ? "border-red-500 ring-2 ring-red-100"
                : "border-gray-100"
            }`}
          >
            <p className="text-gray-500 font-medium">Fraud Alerts</p>
            <h2 className="text-5xl font-bold text-red-500 mt-4">
              {fraudCount}
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
p-6
shadow-sm
border
border-gray-100
"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F5F7FB] border border-gray-200 text-gray-900 px-5 py-3.5 rounded-2xl outline-none w-full max-w-md focus:bg-white focus:border-[#5B5FEF] transition-all"
            />

            <div className="flex items-center gap-4 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  loadCandidatesByStatus(
                    e.target.value === "All Status" ? "ALL" : e.target.value,
                  );
                }}
                className="bg-[#F5F7FB] border border-gray-200 px-5 py-3.5 rounded-2xl outline-none text-gray-700 font-medium w-full md:w-auto focus:bg-white focus:border-[#5B5FEF] transition-all"
              >
                <option value="All Status">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="REQUEST_SENT">REQUEST_SENT</option>
                <option value="DOCUMENTS_UPLOADED">DOCUMENTS_UPLOADED</option>
                <option value="UNDER_VERIFICATION">UNDER_VERIFICATION</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="FRAUD_ALERT">FRAUD_ALERT</option>
              </select>

              <div className="relative w-fit">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="bg-[#F5F7FB] border border-gray-200 p-3 rounded-2xl hover:bg-white transition-all">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
          <div className="overflow-auto max-h-[650px]">
            <table className="w-full min-w-[1100px]">
              <thead className="sticky top-0 z-20 bg-[#F8FAFC] border-b border-gray-100">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-semibold text-sm">
                    Candidate
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-sm">
                    Phone
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-sm">
                    Email
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-sm">
                    Progress
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length > 0 ? (
                  displayedCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-all"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#5B5FEF] font-bold text-lg border border-indigo-100">
                            {candidate.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-gray-900 font-bold">
                              {candidate.full_name}
                            </p>
                            <p className="text-gray-400 text-xs mt-0.5 font-medium">
                              Candidate ID #{candidate.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-gray-700 font-semibold text-sm">
                        {candidate.phone}
                      </td>
                      <td className="p-6 text-gray-500 text-sm font-medium">
                        {candidate.email}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                            candidate.status === "VERIFIED"
                              ? "bg-green-50 text-green-600 border-green-100"
                              : candidate.status === "PENDING"
                                ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                                : candidate.status === "REQUEST_SENT"
                                  ? "bg-blue-50 text-blue-600 border-blue-100"
                                  : candidate.status === "DOCUMENTS_UPLOADED"
                                    ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                    : candidate.status === "UNDER_VERIFICATION"
                                      ? "bg-purple-50 text-purple-600 border-purple-100"
                                      : "bg-red-50 text-red-600 border-red-100"
                          }`}
                        >
                          {candidate.status}
                        </span>
                      </td>

                      {/* Progress Bar */}
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                candidate.status === "FRAUD_ALERT"
                                  ? "bg-red-500"
                                  : candidate.status === "VERIFIED"
                                    ? "bg-green-500"
                                    : "bg-[#5B5FEF]"
                              }`}
                              style={{
                                width: `${Math.min(candidate.progress || 0, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-600 min-w-[40px]">
                            {Math.min(candidate.progress || 0, 100)}%
                          </span>
                        </div>
                      </td>

                      {/* Dynamic Workflow Actions */}
                      <td className="p-6">
                        <div className="flex items-center gap-3 min-w-[280px]">
                          {candidate.status === "PENDING" ? (
                            <button
                              onClick={() =>
                                sendVerificationRequest(candidate.id)
                              }
                              className="w-[140px] h-[40px] rounded-xl text-xs font-bold text-white bg-[#5B5FEF] hover:bg-[#4B4FD8] shadow-sm transition-all"
                            >
                              Send Request
                            </button>
                          ) : candidate.status === "REQUEST_SENT" ? (
                            <button
                              disabled
                              className="w-[140px] h-[40px] rounded-xl text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 cursor-not-allowed"
                            >
                              Awaiting Upload
                            </button>
                          ) : candidate.status === "DOCUMENTS_UPLOADED" ? (
                            <button
                              onClick={() => navigate("/verification/queue")}
                              className="w-[140px] h-[40px] rounded-xl text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 shadow-sm transition-all"
                            >
                              Go to Queue
                            </button>
                          ) : candidate.status === "UNDER_VERIFICATION" ? (
                            <button
                              onClick={() =>
                                navigate(
                                  `/verification/candidate/${candidate.id}`,
                                )
                              }
                              className="w-[140px] h-[40px] rounded-xl text-xs font-bold text-white bg-purple-500 hover:bg-purple-600 shadow-sm transition-all"
                            >
                              Open Verification
                            </button>
                          ) : (
                            <button
                              disabled
                              className={`w-[140px] h-[40px] rounded-xl text-xs font-bold text-white cursor-default shadow-sm ${
                                candidate.status === "VERIFIED"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {candidate.status}
                            </button>
                          )}

                          {/* Standard Actions Icons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(`/candidates/${candidate.id}`)
                              }
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/candidates/edit/${candidate.id}`)
                              }
                              className="p-2 transition-all rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                              title="Edit Candidate"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCandidate(candidate.id)}
                              className="p-2 transition-all rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete Candidate"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-16 text-center text-gray-400 font-medium text-sm"
                    >
                      No candidates found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredCandidates.length > 10 && (
              <div className="p-5 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="
        text-indigo-600
        hover:text-indigo-800
        font-semibold
        text-sm
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

export default Candidates;
