import DashboardLayout from "../../layouts/DashboardLayout";
import BackToVerification from "../../components/verification/BackToVerification";
import { useState } from "react";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Clock,
  Database,
} from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface CreditCheckRequest {
  id: string;
  candidateId: number;
  candidate: string;
  creditScore: string;
  riskCategory: string;
  bureauStatus: string;
}

function CreditBureauCheck() {
  const [search, setSearch] = useState("");
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(() => {
    return JSON.parse(localStorage.getItem("candidates") || "[]");
  });

  // Workflow Trigger: Updates candidate progress and verification status
  const verifyCreditBureau = (candidateId: number) => {
    const freshMasterList: Candidate[] = JSON.parse(localStorage.getItem("candidates") || "[]");
    
    const updated = freshMasterList.map((c: Candidate) => {
      if (c.id === candidateId) {
        return {
          ...c,
          status: "Under Verification",
          progress: (c.progress || 0) + 16, // Increment module progress
        };
      }
      return c;
    });

    localStorage.setItem("candidates", JSON.stringify(updated));
    setLocalCandidates(updated);
    alert("Credit Bureau check verified successfully.");
  };

  // Only show candidates currently in the pipeline
  const creditRequests: CreditCheckRequest[] = localCandidates
    .filter((c: Candidate) => c.status !== "Verified" && c.status !== "Rejected")
    .map((c: Candidate) => ({
      id: `CRD-${1000 + c.id}`,
      candidateId: c.id,
      candidate: c.name || "Unknown",
      creditScore: "750",
      riskCategory: "Low",
      bureauStatus: "Pending",
    }));

  const filteredRequests = creditRequests.filter(
    (item) =>
      item.candidate.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <BackToVerification />
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Credit Bureau Check Engine</h1>
            <p className="text-gray-500 mt-2">AI-powered credit profile validation and financial risk assessment</p>
          </div>
          <div className="bg-green-50 text-green-700 border border-green-100 px-5 py-4 rounded-2xl font-semibold text-sm shadow-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Credit bureau records synchronized from verification workflow</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Pipeline Queue</p>
              <h2 className="text-4xl font-bold mt-2">{creditRequests.length}</h2>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Database className="w-5 h-5" /></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Good Standing</p>
              <h2 className="text-4xl font-bold mt-2 text-green-500">{localCandidates.filter(c => c.moduleStatuses?.["Credit Bureau"] === "Verified").length}</h2>
            </div>
            <div className="p-3 bg-green-50 text-green-500 rounded-2xl"><CheckCircle className="w-5 h-5" /></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Under Review</p>
              <h2 className="text-4xl font-bold mt-2 text-yellow-500">{creditRequests.length}</h2>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-500 rounded-2xl"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Risk Alerts</p>
              <h2 className="text-4xl font-bold mt-2 text-red-500">0</h2>
            </div>
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><AlertTriangle className="w-5 h-5" /></div>
          </div>
        </div>

        {/* AI Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
              <h2 className="text-lg font-bold text-gray-900">Credit Risk AI</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">Evaluates credit score patterns and stability indicators.</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><CreditCard className="w-5 h-5" /></div>
              <h2 className="text-lg font-bold text-gray-900">Bureau Validation AI</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">Cross-validates bureau records and account histories.</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl"><ShieldCheck className="w-5 h-5" /></div>
              <h2 className="text-lg font-bold text-gray-900">Financial Fraud AI</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">Detects identity misuse and high-risk lending behavior.</p>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">Audit Task Logs</h2>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-3 outline-none w-[320px] text-sm"
            />
          </div>
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Request ID</th>
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Credit Score</th>
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="p-6 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((item) => (
                <tr key={item.id}>
                  <td className="p-6 font-bold text-sm">{item.id}</td>
                  <td className="p-6 text-sm font-semibold">{item.candidate}</td>
                  <td className="p-6 text-sm text-gray-600">{item.creditScore}</td>
                  <td className="p-6">
                    <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">{item.bureauStatus}</span>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => verifyCreditBureau(item.candidateId)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                    >
                      Verify Credit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreditBureauCheck;