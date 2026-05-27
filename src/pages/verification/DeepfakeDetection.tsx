import DashboardLayout from "../../layouts/DashboardLayout";
import BackToVerification from "../../components/verification/BackToVerification";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface DeepfakeRequest {
  id: string;
  candidateId: number;
  candidate: string;
  confidenceScore: string;
  status: string;
}

function DeepfakeDetection() {
  const [search, setSearch] = useState("");
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(() => 
    JSON.parse(localStorage.getItem("candidates") || "[]")
  );

  const verifyDeepfake = (candidateId: number) => {
    const freshMasterList: Candidate[] = JSON.parse(localStorage.getItem("candidates") || "[]");
    const updated = freshMasterList.map((c: Candidate) => 
      c.id === candidateId ? { ...c, moduleStatuses: { ...(c.moduleStatuses || {}), "Deepfake Detection": "Verified" }, status: "Under Verification", progress: Math.min(100, (c.progress || 0) + 15) } : c
    );
    localStorage.setItem("candidates", JSON.stringify(updated));
    setLocalCandidates(updated);
    alert("Deepfake analysis completed.");
  };

  const requests: DeepfakeRequest[] = localCandidates
    .filter((c: Candidate) => c.status !== "Verified" && c.moduleStatuses?.["Deepfake Detection"] !== "Verified")
    .map((c: Candidate) => ({
      id: `DFK-${1000 + c.id}`,
      candidateId: c.id,
      candidate: c.name || "Unknown",
      confidenceScore: "97%",
      status: "Pending"
    }));

  const filtered = requests.filter(r => r.candidate.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <BackToVerification />
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Deepfake Detection Engine</h1>
            <p className="text-gray-500 mt-2">AI-powered facial authenticity analysis and synthetic media detection</p>
          </div>
          <div className="bg-green-50 text-green-700 border border-green-100 px-5 py-4 rounded-2xl font-semibold text-sm shadow-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Records generated automatically</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Scans</p>
            <h2 className="text-4xl font-bold mt-2">{requests.length}</h2>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-500">Authentic</p>
            <h2 className="text-4xl font-bold mt-2 text-green-500">{localCandidates.filter(c => c.moduleStatuses?.["Deepfake Detection"] === "Verified").length}</h2>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-500">Under Review</p>
            <h2 className="text-4xl font-bold mt-2 text-yellow-500">{requests.length}</h2>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-500">Fraud Alerts</p>
            <h2 className="text-4xl font-bold mt-2 text-red-500">0</h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold">Deepfake Detection Requests</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 w-[320px] text-sm"
            />
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-6 text-left text-xs text-gray-500">Request ID</th>
                <th className="p-6 text-left text-xs text-gray-500">Candidate</th>
                <th className="p-6 text-left text-xs text-gray-500">Confidence</th>
                <th className="p-6 text-center text-xs text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id}>
                  <td className="p-6 font-bold text-sm">{item.id}</td>
                  <td className="p-6 font-semibold text-sm">{item.candidate}</td>
                  <td className="p-6 font-bold text-sm text-blue-600">{item.confidenceScore}</td>
                  <td className="p-6 text-center">
                    <button onClick={() => verifyDeepfake(item.candidateId)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all">
                      Analyze Media
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

export default DeepfakeDetection;