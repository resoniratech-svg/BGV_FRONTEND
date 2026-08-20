import DashboardLayout from "../../layouts/DashboardLayout";
import BackToVerification from "../../components/verification/BackToVerification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useVerificationModule } from "../../hooks/useVerificationModule";
import VerificationStatsCards from "../../components/verification/VerificationStatsCards";

interface SalaryRequest {
  id: string;
  candidateId: number;
  candidate: string;
  employer: string;
  salary: string;
  month: string;
  status: string;
}

function SalarySlipVerification() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Integrated unified verification core hook system
  const {
    stats,
    candidates,
    activeFilter,
    loadCandidatesByStatus
  } = useVerificationModule("salary-slip");

  const verifySalary = (candidateId: number) => {
    navigate(`/verification/candidate/${candidateId}`, {
      state: {
        from: "salary-slip"
      }
    });
  };

  const salaryRequests: SalaryRequest[] = candidates.map((candidate) => ({
    id: `SLP-${candidate.candidate_id}`,
    candidateId: candidate.candidate_id,
    candidate: candidate.candidate_name,
    employer: "Previous Company",
    salary: "₹50,000",
    month: "April 2026",
    status: candidate.status || "PENDING"
  }));

  const filteredRequests = salaryRequests.filter(item =>
    (item.candidate && item.candidate.toLowerCase().includes(search.toLowerCase())) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <BackToVerification />
      <div className="space-y-8 max-w-6xl mx-auto pb-12 mt-4">
        {/* Header Block */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Salary Slip Verification Engine</h1>
            <p className="text-gray-500 mt-2">AI-powered payroll validation and compensation verification</p>
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
            <h2 className="text-xl font-bold text-gray-900">Salary Verification Requests</h2>
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
                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Request ID</th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate Target</th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employer</th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-6 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map(item => (
                    <tr key={item.id} className="hover:bg-[#FAFBFF] transition-all">
                      <td className="p-6 font-bold text-sm text-gray-900">{item.id}</td>
                      <td className="p-6 text-sm text-gray-800 font-semibold">{item.candidate}</td>
                      <td className="p-6 text-sm text-gray-600 font-medium">{item.employer}</td>
                      <td className="p-6">
                        <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-100">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => verifySalary(item.candidateId)} 
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                        >
                          Verify Salary
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-16 text-center text-gray-400 font-medium text-sm">
                      No active salary verification requests pending.
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

export default SalarySlipVerification;