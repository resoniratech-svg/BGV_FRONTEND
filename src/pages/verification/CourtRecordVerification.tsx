import DashboardLayout from "../../layouts/DashboardLayout";
import BackToVerification from "../../components/verification/BackToVerification";
import { useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
} from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface CourtRequest {
  id: string;
  candidateId: number;
  candidate: string;
  courtRecordId: string;
  caseType: string;
  status: string;
}

function CourtRecordVerification() {
  const [search, setSearch] = useState("");
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(() => {
    return JSON.parse(localStorage.getItem("candidates") || "[]");
  });

  // Verification Logic: Updates the candidate record and persists to localStorage
  const verifyCourtRecord = (candidateId: number) => {
    const freshMasterList: Candidate[] = JSON.parse(localStorage.getItem("candidates") || "[]");
    
    const updated = freshMasterList.map((c: Candidate) => {
      if (c.id === candidateId) {
        return {
          ...c,
          // Assuming courtRecordStatus as a field in your global Candidate type
          status: "Under Verification",
          progress: (c.progress || 0) + 16, 
        };
      }
      return c;
    });

    localStorage.setItem("candidates", JSON.stringify(updated));
    setLocalCandidates(updated);
    alert("Court Record Verified Successfully.");
  };

  // Filter candidates waiting for this specific module
  const courtRequests: CourtRequest[] = localCandidates
    .filter((c: Candidate) => c.status !== "Verified" && c.status !== "Rejected")
    .map((c: Candidate, _index: number) => ({
      id: `CRT-${1000 + c.id}`,
      candidateId: c.id,
      candidate: c.name || "Unknown",
      courtRecordId: "CR-" + Math.floor(Math.random() * 9000),
      caseType: "Civil/Criminal",
      status: "Pending",
    }));

  const filteredRequests = courtRequests.filter((item) =>
    item.candidate.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <BackToVerification />
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Court Record Verification</h1>
            <p className="text-gray-500 mt-2">AI-powered legal risk assessment and case history auditing</p>
          </div>
          <div className="bg-green-50 text-green-700 border border-green-100 px-5 py-4 rounded-2xl font-semibold text-sm shadow-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Integrated with national legal databases</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Queue</p>
              <h2 className="text-4xl font-bold mt-2">{courtRequests.length}</h2>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Database className="w-5 h-5" /></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Clean Records</p>
              <h2 className="text-4xl font-bold mt-2 text-green-500">{localCandidates.filter(c => c.moduleStatuses?.["Court Record"] === "Verified").length}</h2>
            </div>
            <div className="p-3 bg-green-50 text-green-500 rounded-2xl"><CheckCircle className="w-5 h-5" /></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Under Review</p>
              <h2 className="text-4xl font-bold mt-2 text-yellow-500">{courtRequests.length}</h2>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-500 rounded-2xl"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Legal Alerts</p>
              <h2 className="text-4xl font-bold mt-2 text-red-500">0</h2>
            </div>
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><AlertTriangle className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Verification Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">Audit Task Logs</h2>
            <input
              type="text"
              placeholder="Search tasks..."
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
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Case Type</th>
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="p-6 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 font-bold text-sm">{item.id}</td>
                  <td className="p-6 text-sm font-semibold">{item.candidate}</td>
                  <td className="p-6 text-sm text-gray-600">{item.caseType}</td>
                  <td className="p-6 text-sm">
                    <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">{item.status}</span>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => verifyCourtRecord(item.candidateId)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                      Verify Record
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

export default CourtRecordVerification;