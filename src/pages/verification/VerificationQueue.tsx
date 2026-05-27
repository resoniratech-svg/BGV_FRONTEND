import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  CheckCircle, ExternalLink } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface QueueItem {
  id: string;
  candidateId: number;
  candidate: string;
  verification: string;
  priority: string;
  status: string;
  progress: number;
}

function VerificationQueue() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All Priorities");

  // Localized live cache state management
  const [localCandidates] = useState<Candidate[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("candidates") || "[]");
    } catch {
      return [];
    }
  });

  // Map candidates to Queue Items based on their workflow status
  // Only showing those that are in progress or need review
  const queueData: QueueItem[] = localCandidates
    .filter((c) => c.status !== "Pending" && c.status !== "Verified" && c.status !== "Rejected")
    .map((candidate: Candidate, index: number) => {
      let derivedPriority = "Medium";
      if (candidate.status === "Fraud Alert") derivedPriority = "Critical";
      else if (candidate.status === "Under Verification") derivedPriority = "High";
      else if (candidate.status === "Documents Uploaded") derivedPriority = "High";

      const name = candidate.name || `${candidate.first_name || ""} ${candidate.last_name || ""}`.trim() || "Unknown Candidate";

      return {
        id: `BGV-${1000 + (candidate.id || index + 1)}`,
        candidateId: candidate.id,
        candidate: name,
        verification: "Background Verification",
        priority: derivedPriority,
        reviewer: candidate.reviewer || "System Assigned",
        status: candidate.status,
        sla: "24 hrs",
        progress: candidate.progress ?? 0,
      };
    });

  const filteredQueue = queueData.filter((item: QueueItem) => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.candidate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "All Priorities" || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-gray-900 text-4xl font-bold">Verification Queue</h1>
            <p className="text-gray-500 mt-2">Process ongoing modular pipeline applicant validations</p>
          </div>
          <div className="bg-green-50 text-green-700 border border-green-100 px-5 py-4 rounded-2xl font-semibold text-sm shadow-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>Verification records are generated automatically</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
            <input
              type="text"
              placeholder="Search active execution routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-3.5 outline-none w-full max-w-md focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 transition-all text-sm text-gray-900"
            />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#F5F7FB] border border-gray-200 px-4 py-3.5 rounded-2xl outline-none text-sm text-gray-700 font-medium transition-all"
            >
              <option value="All Priorities">All System Priorities</option>
              <option value="High">High Priority Track</option>
              <option value="Medium">Medium Priority Track</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Queue ID</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Target Candidate</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Status</th>
                  <th className="text-center p-6 text-gray-500 font-semibold text-xs">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredQueue.map((item: QueueItem) => (
                  <tr key={item.id} className="hover:bg-[#FAFBFF] transition-all">
                    <td className="p-6 font-bold text-gray-900 text-sm">{item.id}</td>
                    <td className="p-6 text-sm text-gray-800 font-semibold">{item.candidate}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        item.status === "Documents Uploaded" ? "bg-blue-50 text-blue-600 border-blue-100" :
                        item.status === "Under Verification" ? "bg-purple-50 text-purple-600 border-purple-100" :
                        item.status === "Fraud Alert" ? "bg-red-50 text-red-600 border-red-100" :
                        "bg-gray-50 text-gray-600 border-gray-100"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-6 flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/verification/candidate/${item.candidateId}`)}
                        className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Open Verification
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default VerificationQueue;