import DashboardLayout from "../../layouts/DashboardLayout";
import BackToVerification from "../../components/verification/BackToVerification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle, Clock, AlertTriangle, ScanFace, Database, ArrowLeft } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface FaceMatchRequest {
  id: string;
  candidateId: number;
  candidate: string;
  matchScore: string;
  status: string;
}

function FaceMatch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(() => 
    JSON.parse(localStorage.getItem("candidates") || "[]")
  );

  const verifyFaceMatch = (candidateId: number) => {
    const freshMasterList: Candidate[] = JSON.parse(localStorage.getItem("candidates") || "[]");
    
    const updated = freshMasterList.map((c: Candidate) => 
      c.id === candidateId ? { 
        ...c, 
        faceMatchStatus: "Completed",
        status: "Under Verification", 
        progress: (c.progress || 0) + 16 
      } : c
    );

    localStorage.setItem("candidates", JSON.stringify(updated));
    setLocalCandidates(updated);
    alert("Biometric Face Match Completed Successfully.");
  };

  const requests: FaceMatchRequest[] = localCandidates
    .filter((c: Candidate) => c.status !== "Verified" && c.faceMatchStatus !== "Completed")
    .map((c: Candidate) => ({
      id: `FMT-${1000 + c.id}`,
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
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/verification")} className="p-3 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm text-gray-600 hover:text-gray-900 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Face Match AI</h1>
            <p className="text-gray-500 mt-2">Biometric facial perimeter point auditing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ScanFace className="w-6 h-6"/></div>
                <div>
                    <p className="text-sm text-gray-500">Active Queue</p>
                    <h2 className="text-2xl font-bold">{requests.length}</h2>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><CheckCircle className="w-6 h-6"/></div>
                <div>
                    <p className="text-sm text-gray-500">Verified</p>
                    <h2 className="text-2xl font-bold">{localCandidates.filter(c => c.faceMatchStatus === "Completed").length}</h2>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><AlertTriangle className="w-6 h-6"/></div>
                <div>
                    <p className="text-sm text-gray-500">Fraud Alerts</p>
                    <h2 className="text-2xl font-bold">0</h2>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-3.5 w-full sm:w-[320px] outline-none text-sm"
            />
          </div>
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="p-6 text-left text-xs font-semibold text-gray-500">Request ID</th>
                <th className="p-6 text-left text-xs font-semibold text-gray-500">Candidate</th>
                <th className="p-6 text-left text-xs font-semibold text-gray-500">Match Score</th>
                <th className="p-6 text-center text-xs font-semibold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id}>
                  <td className="p-6 font-bold text-sm">{item.id}</td>
                  <td className="p-6 font-semibold text-sm">{item.candidate}</td>
                  <td className="p-6 font-bold text-sm text-blue-600">{item.matchScore}</td>
                  <td className="p-6 text-center">
                    <button onClick={() => verifyFaceMatch(item.candidateId)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all">
                      Verify Biometrics
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

export default FaceMatch;