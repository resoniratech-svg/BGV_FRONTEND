import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, AlertTriangle, CheckCircle, ShieldAlert, FileText } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface AuditLog {
  id: string;
  action: string;
  user: string;
  time: string;
  status: "Success" | "Warning" | "Critical";
  candidateId?: number;
}

function AuditLogs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("candidates");
    if (saved) setCandidates(JSON.parse(saved));
  }, []);

  const generatedLogs = useMemo(() => {
    const logs: AuditLog[] = [];
    let logId = 1000;

    candidates.forEach((c) => {
      // 1. Candidate Creation
      logs.push({
        id: `AUD-${logId++}`,
        action: `Profile Created: ${c.name || "Unknown"}`,
        user: "Admin System",
        time: "Tracked",
        status: "Success",
        candidateId: c.id
      });
      
      // 2. Uploads
      if (c.progress && c.progress >= 20) {
        logs.push({
          id: `AUD-${logId++}`,
          action: `Documents Uploaded for ${c.name}`,
          user: c.name || "Candidate",
          time: "Tracked",
          status: "Success",
          candidateId: c.id
        });
      }

      // 3. Module Actions
      if (c.moduleStatuses) {
        Object.entries(c.moduleStatuses).forEach(([module, status]) => {
          if (status === "Verified") {
            logs.push({
              id: `AUD-${logId++}`,
              action: `${module} Validated for ${c.name}`,
              user: "AI Engine",
              time: "Tracked",
              status: "Success",
              candidateId: c.id
            });
          } else if (status === "Fraud") {
            logs.push({
              id: `AUD-${logId++}`,
              action: `Critical Fraud in ${module} for ${c.name}`,
              user: "Security Node",
              time: "Tracked",
              status: "Critical",
              candidateId: c.id
            });
          } else if (status === "Rejected") {
            logs.push({
              id: `AUD-${logId++}`,
              action: `${module} Rejected for ${c.name}`,
              user: "Audit Protocol",
              time: "Tracked",
              status: "Warning",
              candidateId: c.id
            });
          }
        });
      }
    });

    return logs.reverse();
  }, [candidates]);

  const filteredLogs = generatedLogs.filter((log) => {
    return (
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const criticalCount = generatedLogs.filter(l => l.status === "Critical").length;
  const successCount = generatedLogs.filter(l => l.status === "Success").length;
  const warningCount = generatedLogs.filter(l => l.status === "Warning").length;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-500 mt-2">Immutable system activity tracking and compliance ledger</p>
          </div>

          <button 
            onClick={() => alert("Downloading encrypted audit logs...")} 
            className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <Download className="w-5 h-5" />
            Export Secure Logs
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Total Ledger Entries</p>
              <div className="p-2 bg-gray-50 rounded-xl"><FileText className="w-4 h-4 text-gray-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-gray-900">{generatedLogs.length}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Critical Events</p>
              <div className="p-2 bg-red-50 rounded-xl"><ShieldAlert className="w-4 h-4 text-red-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-red-500">{criticalCount}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
               <p className="text-gray-500 font-medium text-sm">Successful Operations</p>
               <div className="p-2 bg-green-50 rounded-xl"><CheckCircle className="w-4 h-4 text-green-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-green-500">{successCount}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
               <p className="text-gray-500 font-medium text-sm">System Warnings</p>
               <div className="p-2 bg-yellow-50 rounded-xl"><AlertTriangle className="w-4 h-4 text-yellow-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-yellow-500">{warningCount}</h2>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Top Bar */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Activity Logs</h2>
            <div className="relative w-full sm:w-auto">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search ledger entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F5F7FB] border border-gray-200 rounded-2xl pl-11 pr-5 py-3.5 outline-none w-full sm:w-[320px] focus:bg-white focus:border-[#5B5FEF] transition-all text-sm text-gray-900"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Log ID</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Action</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Originator (User / System)</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Timestamp</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">Status</th>
                  <th className="text-center p-6 text-gray-500 font-semibold text-xs">Reference Data</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="p-6 font-bold text-gray-900 text-sm tracking-tight">{log.id}</td>
                      <td className="p-6 font-medium text-gray-800 text-sm">{log.action}</td>
                      <td className="p-6 text-sm text-gray-600 font-semibold">{log.user}</td>
                      <td className="p-6 text-sm text-gray-500 font-medium">{log.time}</td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block ${
                            log.status === "Critical"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : log.status === "Success"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : log.status === "Warning"
                              ? "bg-orange-50 text-orange-700 border-orange-100"
                              : "bg-blue-50 text-blue-700 border-blue-100"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => {
                               if (log.candidateId) navigate(`/candidates/${log.candidateId}`)
                            }}
                            disabled={!log.candidateId}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                              log.candidateId 
                                ? "bg-[#5B5FEF] text-white hover:bg-[#4B4FD8]" 
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Trace Origin
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-gray-400 font-medium text-sm">
                      No system ledger records found matching your exact search pattern.
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

export default AuditLogs;