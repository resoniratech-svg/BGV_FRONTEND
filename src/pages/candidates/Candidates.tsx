import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";
import type { Candidate } from "../../types/Candidate";// <-- Using Global Type\



const DEFAULT_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    status: "Verified",
    role: "Software Engineer",
    progress: 100,
  },
  {
    id: 2,
    name: "Priya Reddy",
    email: "priya@example.com",
    status: "Pending",
    role: "Data Analyst",
    progress: 0,
  },
  {
    id: 3,
    name: "Arjun Patel",
    email: "arjun@example.com",
    status: "Fraud Alert",
    role: "UI/UX Designer",
    progress: 80,
  },
];

function Candidates() {
  const navigate = useNavigate();

  const [candidateList, setCandidateList] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem("candidates");
    return saved ? JSON.parse(saved) : DEFAULT_CANDIDATES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Latest");

  const deleteCandidate = (id: number) => {
    if (confirm("Are you sure you want to remove this candidate?")) {
      const updated = candidateList.filter((c) => c.id !== id);
      setCandidateList(updated);
      localStorage.setItem("candidates", JSON.stringify(updated));
    }
  };

  const totalCandidates = candidateList.length;

  const verifiedCount = candidateList.filter(
    (candidate) => candidate.status === "Verified"
  ).length;

  const pendingCount = candidateList.filter(
    (candidate) =>
      candidate.status === "Pending" || candidate.status === "Request Sent"
  ).length;

  const fraudCount = candidateList.filter(
    (candidate) => candidate.status === "Fraud Alert"
  ).length;

  const filteredCandidates = candidateList
    .filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (candidate.role && candidate.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        String(candidate.id).includes(searchQuery);

      const matchesStatus =
        statusFilter === "All Status" || candidate.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "Latest") {
        return b.id - a.id;
      }
      return a.id - b.id;
    });

  const updateCandidateStatus = (
    candidateId: number,
    nextStatus: string,
    nextProgress: number
  ) => {
    const updatedCandidates = candidateList.map((candidate) =>
      candidate.id === candidateId
        ? {
            ...candidate,
            status: nextStatus,
            progress: nextProgress,
          }
        : candidate
    );

    setCandidateList(updatedCandidates);
    localStorage.setItem("candidates", JSON.stringify(updatedCandidates));
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
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">Total Candidates</p>
            <h2 className="text-5xl font-bold text-gray-900 mt-4">
              {totalCandidates}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">Verified</p>
            <h2 className="text-5xl font-bold text-green-500 mt-4">
              {verifiedCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">Pending</p>
            <h2 className="text-5xl font-bold text-yellow-500 mt-4">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">Fraud Alerts</p>
            <h2 className="text-5xl font-bold text-red-500 mt-4">
              {fraudCount}
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
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
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F5F7FB] border border-gray-200 px-5 py-3.5 rounded-2xl outline-none text-gray-700 font-medium w-full md:w-auto focus:bg-white focus:border-[#5B5FEF] transition-all"
              >
                <option value="All Status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Request Sent">Request Sent</option>
                <option value="Documents Uploaded">Documents Uploaded</option>
                <option value="Under Verification">Under Verification</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
                <option value="Fraud Alert">Fraud Alert</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-[#F5F7FB] border border-gray-200 px-5 py-3.5 rounded-2xl outline-none text-gray-700 font-medium w-full md:w-auto focus:bg-white focus:border-[#5B5FEF] transition-all"
              >
                <option value="Latest">Latest</option>
                <option value="Oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-[#F8FAFC] border-b border-gray-100">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-semibold text-sm">
                    Candidate
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-sm">
                    Role
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
                  filteredCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-all"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#5B5FEF] font-bold text-lg border border-indigo-100">
                            {candidate.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-gray-900 font-bold">
                              {candidate.name}
                            </p>
                            <p className="text-gray-400 text-xs mt-0.5 font-medium">
                              Candidate ID #{candidate.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-gray-700 font-semibold text-sm">
                        {candidate.role || candidate.job_role || "Associate"}
                      </td>
                      <td className="p-6 text-gray-500 text-sm font-medium">
                        {candidate.email}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                            candidate.status === "Verified"
                              ? "bg-green-50 text-green-600 border-green-100"
                              : candidate.status === "Pending"
                              ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                              : candidate.status === "Request Sent"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : candidate.status === "Documents Uploaded"
                              ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                              : candidate.status === "Under Verification"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : candidate.status === "Rejected"
                              ? "bg-gray-50 text-gray-600 border-gray-200"
                              : "bg-red-50 text-red-600 border-red-100"
                          }`}
                        >
                          {candidate.status}
                        </span>
                      </td>

                      {/* Progress */}
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                candidate.status === "Fraud Alert"
                                  ? "bg-red-500"
                                  : candidate.status === "Verified"
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

                      {/* Action */}
                      <td className="p-6">
                        <div className="flex items-center gap-3 min-w-[280px]">
                          {/* Workflow specific action button */}
                          {candidate.status === "Pending" ? (
                            <button
                              onClick={() =>
                                updateCandidateStatus(candidate.id, "Request Sent", 20)
                              }
                              className="w-[140px] h-[40px] rounded-xl text-xs font-bold text-white bg-[#5B5FEF] hover:bg-[#4B4FD8] shadow-sm transition-all"
                            >
                              Send Request
                            </button>
                          ) : candidate.status === "Request Sent" ? (
                            <button
                              disabled
                              className="w-[140px] h-[40px] rounded-xl text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 cursor-not-allowed"
                            >
                              Awaiting Upload
                            </button>
                          ) : candidate.status === "Documents Uploaded" ? (
                            <button
                              onClick={() => navigate("/verification/queue")}
                              className="w-[140px] h-[40px] rounded-xl text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 shadow-sm transition-all"
                            >
                              Go to Queue
                            </button>
                          ) : candidate.status === "Under Verification" ? (
                            <button
                              onClick={() => navigate(`/verification/candidate/${candidate.id}`)}
                              className="w-[140px] h-[40px] rounded-xl text-xs font-bold text-white bg-purple-500 hover:bg-purple-600 shadow-sm transition-all"
                            >
                              Open Verification
                            </button>
                          ) : (
                            <button
                              disabled
                              className={`w-[140px] h-[40px] rounded-xl text-xs font-bold text-white cursor-default shadow-sm ${
                                candidate.status === "Verified"
                                  ? "bg-green-500"
                                  : candidate.status === "Rejected"
                                  ? "bg-gray-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {candidate.status}
                            </button>
                          )}

                          {/* Static View Profile button replaced with action icons */}
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => navigate(`/candidates/${candidate.id}`)}
                               className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                               title="View Profile"
                             >
                               <Eye className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => navigate(`/candidates/edit/${candidate.id}`)}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Candidates;