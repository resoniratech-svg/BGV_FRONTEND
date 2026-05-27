import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShieldAlert, CheckCircle, Clock, AlertTriangle, Cpu, ScanFace, FileWarning, Eye } from "lucide-react";

// Strict Structural Interface Contracts
interface Candidate {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  status: string;
  progress?: number;
  moduleStatuses?: Record<string, string>;
}

interface FraudCase {
  id: string;
  candidateId: number;
  candidate: string;
  issue: string;
  risk: "Critical" | "High" | "Medium";
  status: string;
}

function FraudCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Ingest state directories dynamically from localStorage cache
  const candidates: Candidate[] = JSON.parse(
    localStorage.getItem("candidates") || "[]"
  );

  // Map candidates filter results strictly to structural FraudCase requirements
  const fraudCases: FraudCase[] = candidates
    .filter((candidate: Candidate) => candidate.status === "Fraud Alert" || candidate.status === "Flagged / Rejected")
    .map((candidate: Candidate) => {
      const fallbackName = `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "Unknown Candidate";
      
      // Determine what failed
      let issue = "Verification Risk Detected";
      let risk: "Critical" | "High" | "Medium" = "High";
      
      if (candidate.moduleStatuses) {
         if (Object.values(candidate.moduleStatuses).includes("Fraud")) {
            issue = "Fraudulent Document Detected";
            risk = "Critical";
         } else if (Object.values(candidate.moduleStatuses).includes("Rejected")) {
            issue = "Identity Verification Failed";
            risk = "Medium";
         }
      }

      return {
        id: `FRD-${candidate.id}`,
        candidateId: candidate.id,
        candidate: candidate.name || fallbackName,
        issue,
        risk,
        status: "Action Required",
      };
    });

  // Real-time subset array filtering matches queries against layout values
  const filteredCases = fraudCases.filter((item: FraudCase) => {
    return (
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.risk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // AI Insights Distribution Counts
  const isFailed = (c: Candidate, moduleKey: string) => 
    c.moduleStatuses?.[moduleKey] === "Fraud" || c.moduleStatuses?.[moduleKey] === "Rejected";

  const ocrMismatchesTotal = candidates.filter(c => isFailed(c, "OCR Verification")).length;
  const faceSpoofsTotal = candidates.filter(c => isFailed(c, "Face Match")).length;
  
  const genericAnomaliesCount = fraudCases.length - (ocrMismatchesTotal + faceSpoofsTotal) >= 0 
    ? fraudCases.length - (ocrMismatchesTotal + faceSpoofsTotal) 
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        
        {/* Header Block Row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-gray-900 text-4xl font-bold">Fraud Center</h1>
            <p className="text-gray-500 mt-2">AI-powered risk intelligence, forgery screening, and compliance monitoring</p>
          </div>

          <div className="bg-red-50 text-red-700 border border-red-100 px-5 py-4 rounded-2xl font-semibold text-sm shadow-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Risk Audits isolate background check profile failure cases automatically</span>
          </div>
        </div>

        {/* Dynamic Analytics Counters Grid Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Fraud Cases</p>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-2">{fraudCases.length}</h2>
            </div>
            <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl">
              <FileWarning className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Critical Risks</p>
              <h2 className="text-4xl font-extrabold text-red-500 mt-2">
                {fraudCases.filter((item) => item.risk === "Critical").length}
              </h2>
            </div>
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Under Review</p>
              <h2 className="text-4xl font-extrabold text-yellow-500 mt-2">{fraudCases.length}</h2>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-500 rounded-2xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <h2 className="text-4xl font-extrabold text-green-500 mt-2">0</h2>
            </div>
            <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* AI Fraud Analysis Ingestion Insights Block Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-gray-900">AI Component Discrepancy Breakdown</h2>
            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-md">Distribution Metrics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-red-700 font-bold text-sm">Registry Form Violations</p>
                <h3 className="text-3xl font-black text-red-800 mt-2">{genericAnomaliesCount}</h3>
              </div>
              <div className="p-2 bg-white/60 text-red-600 rounded-xl">
                <Cpu className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-yellow-700 font-bold text-sm">OCR Text Mismatches</p>
                <h3 className="text-3xl font-black text-yellow-800 mt-2">{ocrMismatchesTotal}</h3>
              </div>
              <div className="p-2 bg-white/60 text-yellow-600 rounded-xl">
                <FileWarning className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-bold text-sm">Face Spoof Attempts</p>
                <h3 className="text-3xl font-black text-blue-800 mt-2">{faceSpoofsTotal}</h3>
              </div>
              <div className="p-2 bg-white/60 text-blue-600 rounded-xl">
                <ScanFace className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Fraud Cases Table Table Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Filtering Control Row Header Bar */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-white">
            <h2 className="text-2xl font-semibold text-gray-900">Fraud Cases</h2>
            <div className="relative w-full sm:w-auto">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search fraud cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F5F7FB] border border-gray-200 rounded-2xl pl-11 pr-5 py-3.5 outline-none w-full sm:w-[320px] focus:bg-white focus:border-[#5B5FEF] transition-all text-sm text-gray-900"
              />
            </div>
          </div>

          {/* Core Table Layout Grid */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Case ID</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Candidate</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Issue</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Risk Level</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Status</th>
                  <th className="text-center p-6 text-gray-500 font-semibold text-xs">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredCases.length > 0 ? (
                  filteredCases.map((item: FraudCase) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="p-6 font-bold text-gray-900 text-sm tracking-tight">{item.id}</td>
                      <td className="p-6 text-sm text-gray-800 font-semibold">{item.candidate}</td>
                      <td className="p-6 text-sm text-gray-600 font-medium">{item.issue}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block ${
                          item.risk === "Critical" ? "bg-red-100 text-red-700 border-red-200" :
                          item.risk === "High" ? "bg-orange-100 text-orange-700 border-orange-200" :
                          "bg-yellow-100 text-yellow-700 border-yellow-200"
                        }`}>
                          {item.risk} Risk
                        </span>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100 inline-block">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => alert(`Fraud investigation opened for ${item.candidate}`)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold border border-red-200 flex items-center gap-1.5 transition-all"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Investigate
                          </button>
                          
                          <button
                            onClick={() => navigate(`/candidates/${item.candidateId}`)}
                            className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-gray-400 font-medium text-sm">
                      No active candidate security records match your specified search parameters criteria.
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

export default FraudCenter;