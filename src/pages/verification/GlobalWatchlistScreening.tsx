import DashboardLayout from "../../layouts/DashboardLayout";
import BackToVerification from "../../components/verification/BackToVerification";
import { useState } from "react";
import { CheckCircle, AlertTriangle,  Clock, Database } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface WatchlistRequest {
  id: string;
  candidateId: number;
  candidate: string;
  watchlistSource: string;
  riskLevel: string;
  status: string;
}

function GlobalWatchlistScreening() {
  const [search, setSearch] = useState("");
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(() => 
    JSON.parse(localStorage.getItem("candidates") || "[]")
  );

  const verifyWatchlist = (candidateId: number) => {
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
    alert("Watchlist screening completed successfully.");
  };

  const watchlistRequests: WatchlistRequest[] = localCandidates
    .filter(c => c.status !== "Verified" && c.status !== "Rejected")
    .map(c => ({
      id: `WCH-${1000 + c.id}`,
      candidateId: c.id,
      candidate: c.name || "Unknown",
      watchlistSource: "Global Sanctions",
      riskLevel: "Low",
      status: "Pending"
    }));

  const filteredRequests = watchlistRequests.filter(item =>
    item.candidate.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <BackToVerification />
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Global Watchlist Screening Engine</h1>
            <p className="text-gray-500 mt-2">AI-powered sanctions screening, PEP monitoring and global risk intelligence</p>
          </div>
          <div className="bg-green-50 text-green-700 border border-green-100 px-5 py-4 rounded-2xl font-semibold text-sm shadow-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Records generated automatically from verification workflow</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Total Screenings</p><h2 className="text-4xl font-bold mt-2">{watchlistRequests.length}</h2></div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Database className="w-5 h-5"/></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Cleared</p><h2 className="text-4xl font-bold mt-2 text-green-500">{localCandidates.filter(c => c.moduleStatuses?.["Watchlist"] === "Verified").length}</h2></div>
            <div className="p-3 bg-green-50 text-green-500 rounded-2xl"><CheckCircle className="w-5 h-5"/></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Under Review</p><h2 className="text-4xl font-bold mt-2 text-yellow-500">{watchlistRequests.length}</h2></div>
            <div className="p-3 bg-yellow-50 text-yellow-500 rounded-2xl"><Clock className="w-5 h-5"/></div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Watchlist Hits</p><h2 className="text-4xl font-bold mt-2 text-red-500">0</h2></div>
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><AlertTriangle className="w-5 h-5"/></div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Watchlist Screening Requests</h2>
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
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Risk</th>
                <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="p-6 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 font-bold text-sm">{item.id}</td>
                  <td className="p-6 text-sm font-semibold">{item.candidate}</td>
                  <td className="p-6 text-sm text-gray-600">{item.riskLevel}</td>
                  <td className="p-6"><span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">{item.status}</span></td>
                  <td className="p-6 text-center">
                    <button onClick={() => verifyWatchlist(item.candidateId)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all">Run Screening</button>
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

export default GlobalWatchlistScreening;