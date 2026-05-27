import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShieldCheck, CheckCircle, Clock, AlertTriangle, Cpu, Database, ArrowLeft } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface AadhaarRequest {
  id: string;
  candidateId: number;
  candidate: string;
  score: string;
  status: string;
  risk: string;
}

function AadhaarVerification() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(() => {
    return JSON.parse(localStorage.getItem("candidates") || "[]");
  });

  const verifyAadhaar = (candidateId: number) => {
    const freshMasterList: Candidate[] = JSON.parse(localStorage.getItem("candidates") || "[]");

    const updated = freshMasterList.map((candidate: Candidate) => {
      if (candidate.id === candidateId) {
        return {
          ...candidate,
          moduleStatuses: { ...(candidate.moduleStatuses || {}), "Aadhaar": "Verified" },
          status: "Under Verification",
          progress: Math.min(100, (candidate.progress || 0) + 15),
        };
      }
      return candidate;
    });

    localStorage.setItem("candidates", JSON.stringify(updated));
    setLocalCandidates(updated);
    alert("Identity Verification Completed Successfully.");
  };

  const verificationRequests: AadhaarRequest[] = localCandidates
    .filter((candidate: Candidate) => candidate.status !== "Verified" && candidate.moduleStatuses?.["Aadhaar"] !== "Verified")
    .map((candidate: Candidate) => {
      const fallbackName = `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "Unknown Candidate";
      return {
        id: `AAD-${1000 + candidate.id}`,
        candidateId: candidate.id,
        candidate: candidate.name || fallbackName,
        score: "92%",
        status: "Pending",
        risk: "Low",
      };
    });

  const filteredRequests = verificationRequests.filter((item: AadhaarRequest) =>
    item.candidate.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalRequestsCount = verificationRequests.length;
  const historicVerifiedCount = localCandidates.filter((c: Candidate) => c.moduleStatuses?.["Aadhaar"] === "Verified").length;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header Block with Back Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/verification")}
            className="p-3 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm text-gray-600 hover:text-gray-900 transition-all"
            title="Back to Verification Center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Identity Verification</h1>
            <p className="text-gray-500 mt-2">AI-powered extraction and automated Aadhaar identity pipeline</p>
          </div>
        </div>

        {/* Live Dynamic Metadata Analytics Matrix Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Pipeline Queue</p>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-2">{totalRequestsCount}</h2>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Historical Verified</p>
              <h2 className="text-4xl font-extrabold text-green-500 mt-2">{historicVerifiedCount}</h2>
            </div>
            <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Processing Status</p>
              <h2 className="text-2xl font-bold text-yellow-500 mt-3 flex items-center gap-1.5">
                <Clock className="w-6 h-6" />
                <span>Active</span>
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Anomalous Risk Alerts</p>
              <h2 className="text-4xl font-extrabold text-red-500 mt-2">0</h2>
            </div>
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

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