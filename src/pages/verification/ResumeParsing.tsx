import DashboardLayout from "../../layouts/DashboardLayout";
import BackToVerification from "../../components/verification/BackToVerification";
import { useState } from "react";
import { Search, CheckCircle, Clock, AlertTriangle, Brain, FileText, UserCheck, Database } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface ResumeRequest {
  id: string;
  candidateId: number;
  candidate: string;
  matchScore: string;
  status: string;
}

function ResumeParsing() {
  const [search, setSearch] = useState("");
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(() => 
    JSON.parse(localStorage.getItem("candidates") || "[]")
  );

  const verifyResume = (candidateId: number) => {
    const freshMasterList: Candidate[] = JSON.parse(localStorage.getItem("candidates") || "[]");
    
    const updated = freshMasterList.map((c: Candidate) => 
      c.id === candidateId ? { 
        ...c, 
        status: "Under Verification", 
        progress: (c.progress || 0) + 16 
      } : c
    );

    localStorage.setItem("candidates", JSON.stringify(updated));
    setLocalCandidates(updated);
    alert("Resume parsing and skill extraction completed.");
  };

  const requests: ResumeRequest[] = localCandidates
    .filter((c: Candidate) => c.status !== "Verified" && c.status !== "Rejected")
    .map((c: Candidate) => ({
      id: `RSM-${1000 + c.id}`,
      candidateId: c.id,
      candidate: c.name || "Unknown",
      matchScore: "94%",
      status: "Pending",
    }));

  const filtered = requests.filter(r => r.candidate.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <BackToVerification />
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Resume Parsing Engine</h1>
            <p className="text-gray-500 mt-2">AI-powered resume extraction and candidate intelligence profiling</p>
          </div>
          <div className="bg-green-50 text-green-700 border border-green-100 px-5 py-4 rounded-2xl font-semibold text-sm shadow-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Resume data automatically extracted from profiles</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Total Requests</p><h2 className="text-4xl font-bold mt-2">{requests.length}</h2></div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Database className="w-5 h-5"/></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Parsed</p><h2 className="text-4xl font-bold mt-2 text-green-500">{localCandidates.filter(c => c.moduleStatuses?.["Resume Parsing"] === "Verified").length}</h2></div>
            <div className="p-3 bg-green-50 text-green-500 rounded-2xl"><CheckCircle className="w-5 h-5"/></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Processing</p><h2 className="text-4xl font-bold mt-2 text-yellow-500">{requests.length}</h2></div>
            <div className="p-3 bg-yellow-50 text-yellow-500 rounded-2xl"><Clock className="w-5 h-5"/></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Failed</p><h2 className="text-4xl font-bold mt-2 text-red-500">0</h2></div>
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><AlertTriangle className="w-5 h-5"/></div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Resume Parsing Requests</h2>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-3 w-[320px] text-sm"
            />
          </div>
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Request ID</th>
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Match Score</th>
                <th className="p-6 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 font-bold text-sm">{item.id}</td>
                  <td className="p-6 text-sm font-semibold">{item.candidate}</td>
                  <td className="p-6 text-sm font-bold text-blue-600">{item.matchScore}</td>
                  <td className="p-6 text-center">
                    <button onClick={() => verifyResume(item.candidateId)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all">Parse Resume</button>
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

export default ResumeParsing;