import DashboardLayout from "../../layouts/DashboardLayout";
import BackToVerification from "../../components/verification/BackToVerification";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useVerificationModule } from "../../hooks/useVerificationModule";
import VerificationStatsCards from "../../components/verification/VerificationStatsCards";

interface AadhaarRequest {
  id: string;
  candidateId: number;
  candidate: string;
  score: string;
  status: string;
  risk: string;
}

function AadhaarVerification() {
  const [search, setSearch] = useState("");
  
  // Custom verification hooks standard modular pattern integration
  const {
    stats,
    candidates,
    activeFilter,
    loadCandidatesByStatus
  } = useVerificationModule("aadhaar");

  const verifyAadhaar = (candidateId: number) => {
    window.location.href = `/verification/candidate/${candidateId}`;
  };

  const verificationRequests: AadhaarRequest[] = candidates.map((candidate) => ({
    id: `AAD-${candidate.candidate_id}`,
    candidateId: candidate.candidate_id,
    candidate: candidate.candidate_name,
    score: "92%",
    status: candidate.status || "PENDING",
    risk: candidate.risk_level || "LOW",
  }));

  const filteredRequests = verificationRequests.filter((item: AadhaarRequest) =>
    item.candidate.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <BackToVerification />
      <div className="space-y-8 max-w-6xl mx-auto pb-12 mt-4">
        {/* Header Block */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Identity Verification</h1>
            <p className="text-gray-500 mt-2">AI-powered extraction and automated identity pipeline</p>
          </div>
          <div className="bg-green-50 text-green-700 border border-green-100 px-5 py-4 rounded-2xl font-semibold text-sm shadow-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Records generated automatically from Verification Queue</span>
          </div>
        </div>

        {/* Dynamic Analytics Stats Panel via modular hook system */}
        <VerificationStatsCards
          stats={stats}
          activeFilter={activeFilter}
          onFilterChange={loadCandidatesByStatus}
        />

        {/* Verification Operational Logging Matrix Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-white">
            <h2 className="text-xl font-bold text-gray-900">Identity Audit Task Logs</h2>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-3.5 outline-none w-full sm:w-[320px] text-sm focus:bg-white focus:border-[#5B5FEF] transition-all"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Request ID</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Candidate Target</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Confidence</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Status</th>
                  <th className="text-center p-6 text-gray-500 font-semibold text-xs">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((item: AadhaarRequest) => (
                    <tr key={item.id} className="hover:bg-[#FAFBFF] transition-all">
                      <td className="p-6 font-bold text-gray-900 text-sm">{item.id}</td>
                      <td className="p-6 text-sm text-gray-800 font-semibold">{item.candidate}</td>
                      <td className="p-6 text-sm text-gray-600 font-bold">{item.score}</td>
                      <td className="p-6">
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <button
                          onClick={() => verifyAadhaar(item.candidateId)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                        >
                          Verify Identity
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-16 text-center text-gray-400 font-medium text-sm">
                      No active identity verification requests pending.
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

export default AadhaarVerification;