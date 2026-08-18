import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  FileText,
} from "lucide-react";

import {
  getAuditLogs,
  getAuditStats,
  exportAuditLogs,
} from "../../api/auditApi";
interface AuditLog {
  id: number;
  event: string;
  module: string;
  user_name: string;
  candidate_name: string;
  candidate_id: number;
  status: string;
  created_at: string;
  changes: any;
  old_values?: any;
  new_values?: any;
  remarks: string;
  entity_type: string;
  affected_user_name?: string;
  affected_user_id?: number;
}

type AuditFilterType = "ALL" | "CRITICAL" | "SUCCESS" | "WARNING";

function AuditLogs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    warning: 0,
    critical: 0,
  });

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showChangesModal, setShowChangesModal] = useState(false);

  // 1. Added active state filter tracking mechanism for grid summary selections
  const [activeFilter, setActiveFilter] = useState<AuditFilterType>("ALL");

  useEffect(() => {
    fetchAudit();
  }, []);

  const fetchAudit = async () => {
    try {
      const logsData = await getAuditLogs();
      const statsData = await getAuditStats();
      setLogs(logsData);
      setStats(statsData);
    } catch (err) {
      console.log(err);
    }
  };

  // 2. Multi-tier filter pipeline compounding structural search queries and active card filters
  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      String(log.id).includes(query) ||
      (log.event || "").toLowerCase().includes(query) ||
      (log.module || "").toLowerCase().includes(query) ||
      (log.user_name || "").toLowerCase().includes(query) ||
      (log.candidate_name || "").toLowerCase().includes(query) ||
      (log.status || "").toLowerCase().includes(query) ||
      (log.remarks || "").toLowerCase().includes(query);

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "CRITICAL":
        return log.status === "CRITICAL";
      case "SUCCESS":
        return log.status === "SUCCESS";
      case "WARNING":
        return log.status === "WARNING";
      default:
        return true;
    }
  });
  const handleExportLogs = async () => {
    try {
      const response = await exportAuditLogs();

      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "Audit_Logs.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export audit logs");
    }
  };
  const displayedLogs = showAll ? filteredLogs : filteredLogs.slice(0, 10);
  const criticalCount = stats.critical;
  const successCount = stats.success;
  const warningCount = stats.warning;
  const fieldLabels: Record<string, string> = {
    username: "Username",
    full_name: "Full Name",
    email: "Email",
    phone: "Phone",
    role: "Role",
    is_active: "Status",
  };
  const formatAuditValue = (field: string, value: any) => {
    if (value === null || value === undefined) return "-";

    if (field === "is_active") {
      return value ? "Active" : "Suspended";
    }

    return String(value);
  };
  const handleViewLog = (log: AuditLog) => {
    switch (log.module) {
      case "CANDIDATES":
        if (log.candidate_id) {
          navigate(`/candidates/${log.candidate_id}`);
        }
        break;

      case "DOCUMENTS":
        if (log.candidate_id) {
          navigate(`/uploads/${log.candidate_id}`);
        }
        break;

      case "REPORTS":
        navigate("/reports");
        break;

      case "USERS":
        navigate("/users");
        break;

      case "AADHAAR":
      case "PAN":
      case "PASSPORT":
      case "DRIVING_LICENSE":
      case "FACE_MATCH":
      case "DEEPFAKE":
      case "EDUCATION":
      case "EMPLOYMENT":
      case "SALARY_SLIP":
      case "WATCHLIST":
      case "COURT":
      case "CREDIT":
        if (log.candidate_id) {
          navigate(`/verification/candidate/${log.candidate_id}`);
        }
        break;

      case "FRAUD":
        navigate("/fraud");
        break;

      default:
        console.log("Unknown module:", log.module);
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header Block Row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-500 mt-2">
              Immutable system activity tracking and compliance ledger
            </p>
          </div>

          <button
            onClick={handleExportLogs}
            className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-6 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 font-bold"
          >
            <Download className="w-5 h-5" />
            Export Secure Logs
          </button>
        </div>

        {/* 3. Interactive Analytical KPI Tracking Ledger Grid Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Card 1: Total Ledger Entries */}
          <div
            onClick={() => setActiveFilter("ALL")}
            className={`bg-white rounded-3xl border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 ${
              activeFilter === "ALL"
                ? "border-gray-400 ring-2 ring-gray-400/10 bg-gray-50/30"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">
                Total Ledger Entries
              </p>
              <div
                className={`p-2 rounded-xl transition-colors ${activeFilter === "ALL" ? "bg-gray-200 text-gray-700" : "bg-gray-50 text-gray-500"}`}
              >
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-gray-900">{stats.total}</h2>
          </div>

          {/* Card 2: Critical Events */}
          <div
            onClick={() => setActiveFilter("CRITICAL")}
            className={`bg-white rounded-3xl border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 ${
              activeFilter === "CRITICAL"
                ? "border-red-500 ring-2 ring-red-500/10 bg-red-50/20"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">
                Critical Events
              </p>
              <div
                className={`p-2 rounded-xl transition-colors ${activeFilter === "CRITICAL" ? "bg-red-500 text-white" : "bg-red-50 text-red-500"}`}
              >
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-red-500">
              {criticalCount}
            </h2>
          </div>

          {/* Card 3: Successful Operations */}
          <div
            onClick={() => setActiveFilter("SUCCESS")}
            className={`bg-white rounded-3xl border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 ${
              activeFilter === "SUCCESS"
                ? "border-green-500 ring-2 ring-green-500/10 bg-green-50/20"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">
                Successful Operations
              </p>
              <div
                className={`p-2 rounded-xl transition-colors ${activeFilter === "SUCCESS" ? "bg-green-500 text-white" : "bg-green-50 text-green-500"}`}
              >
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-green-500">
              {successCount}
            </h2>
          </div>

          {/* Card 4: System Warnings */}
          <div
            onClick={() => setActiveFilter("WARNING")}
            className={`bg-white rounded-3xl border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 ${
              activeFilter === "WARNING"
                ? "border-yellow-500 ring-2 ring-yellow-500/10 bg-yellow-50/20"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">
                System Warnings
              </p>
              <div
                className={`p-2 rounded-xl transition-colors ${activeFilter === "WARNING" ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-500"}`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-yellow-500">
              {warningCount}
            </h2>
          </div>
        </div>

        {/* Audit Logs Table Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Filtering Control Bar */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-white">
            <h2 className="text-2xl font-semibold text-gray-900">
              Activity Logs{" "}
              {activeFilter !== "ALL" && (
                <span className="text-sm font-medium text-gray-400">
                  ({activeFilter} View Active)
                </span>
              )}
            </h2>
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

          {/* Core Table Layout Matrix */}
          <div className="overflow-x-auto overflow-y-auto max-h-[650px]">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#F8FAFC] sticky top-0 z-10">
                <tr>
                  <th className="px-8 py-5 text-left">Event</th>
                  <th className="px-8 py-5 text-left">Performed By</th>
                  <th className="px-8 py-5 text-left">Candidate</th>
                  <th className="px-8 py-5 text-center">Result</th>
                  <th className="px-8 py-5 text-left">Date & Time</th>
                  <th className="px-8 py-5 text-center">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredLogs.length > 0 ? (
                  displayedLogs.map((log) => {
                    const eventLabel =
                      {
                        CREATE_CANDIDATE: "Candidate Created",

                        UPDATE_CANDIDATE: "Candidate Updated",
                        RESUME_DECISION: "Resume Decision",
                        DELETE_CANDIDATE: "Candidate Deleted",
                        PAN_VERIFICATION: "PAN Verification",
                        UPLOAD_DOCUMENT: "Document Uploaded",
                        WATCHLIST_DECISION: "Watchlist Decision",
                        PAN_DECISION: "PAN Decision",
                        DEEPFAKE_DECISION: "Deepfake Decision",
                        FACE_MATCH_VERIFICATION: "Face Match Verification",

                        FACE_MATCH_DECISION: "Face Match Decision",
                        SALARY_SLIP_DECISION: "Salary Slip Decision",
                        SALARY_SLIP_VERIFICATION: "Salary Slip Verification",
                        TEST_AUDIT: "Audit Test",
                      }[log.event] ||
                      (log.event ?? "Unknown Event").replaceAll("_", " ");

                    const changes: any[] = [];

                    if (log.old_values && log.new_values) {
                      Object.keys(log.new_values).forEach((key) => {
                        if (log.old_values[key] !== log.new_values[key]) {
                          changes.push({
                            field: key,
                            old: log.old_values[key],
                            new: log.new_values[key],
                          });
                        }
                      });
                    }

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 border-b border-gray-100"
                      >
                        <td className="px-8 py-6 align-middle">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {eventLabel}
                            </p>
                            <p className="text-xs text-gray-400 uppercase">
                              {log.module || "-"}
                            </p>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center">
                              {(log.user_name || "S")[0].toUpperCase()}
                            </div>

                            <div>
                              <p className="font-medium text-gray-900">
                                {log.user_name || "System"}
                              </p>
                              <p className="text-xs text-gray-400">User</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div>
                            <p className="font-medium text-gray-900">
                              {log.entity_type === "user"
                                ? log.affected_user_name || "-"
                                : log.candidate_name || "-"}
                            </p>
                            {log.entity_type === "user"
                              ? log.affected_user_id && (
                                  <p className="text-xs text-gray-400">
                                    User #{log.affected_user_id}
                                  </p>
                                )
                              : log.candidate_id && (
                                  <p className="text-xs text-gray-400">
                                    Candidate #{log.candidate_id}
                                  </p>
                                )}
                          </div>
                        </td>

                        <td className="px-8 py-6 text-center">
                          <span
                            className={`px-3 py-1 rounded-full ${
                              log.status === "SUCCESS"
                                ? "bg-green-100 text-green-700"
                                : log.status === "CRITICAL"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>

                        <td className="p-6">
                          {new Date(log.created_at + "Z").toLocaleString(
                            "en-IN",
                            {
                              timeZone: "Asia/Kolkata",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            },
                          )}
                        </td>

                        <td className="px-8 py-6 text-center">
                          <button
                            disabled={log.event === "DELETE_USER"}
                            onClick={() => {
                              if (changes.length > 0) {
                                setSelectedLog(log);
                                setShowChangesModal(true);
                                return;
                              }

                              handleViewLog(log);
                            }}
                            className={`w-32 py-2 rounded-xl text-white font-medium transition-all ${
                              log.event === "DELETE_USER"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                          >
                            {log.event === "DELETE_USER"
                              ? "Deleted"
                              : changes.length > 0
                                ? "Changes"
                                : "View"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-16 text-center text-gray-400 font-medium text-sm"
                    >
                      No system ledger records found matching your active filter
                      criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredLogs.length > 10 && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="
        text-sm
        font-semibold
        text-indigo-600
        hover:text-indigo-800
        transition-colors
      "
                >
                  {showAll ? "Show Less" : `View All (${filteredLogs.length})`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showChangesModal && selectedLog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[700px] p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Updated Fields
              </h2>
              <button
                onClick={() => setShowChangesModal(false)}
                className="text-gray-400 hover:text-gray-600 font-medium p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase text-gray-400">
                    <th className="py-3 px-2">Field</th>
                    <th className="py-3 px-2">Old Value</th>
                    <th className="py-3 px-2">New Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                  {Object.keys(selectedLog.new_values || {})
                    .filter(
                      (key) =>
                        selectedLog.old_values?.[key] !==
                        selectedLog.new_values?.[key],
                    )
                    .map((key) => (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium text-gray-900">
                          {fieldLabels[key] || key}
                        </td>
                        <td className="py-3 px-2 text-red-600 bg-red-50/30 font-mono text-xs rounded-l-md">
                          {selectedLog.old_values?.[key] !== undefined &&
                          selectedLog.old_values?.[key] !== null
                            ? formatAuditValue(key, selectedLog.old_values[key])
                            : "-"}
                        </td>
                        <td className="py-3 px-2 text-green-600 bg-green-50/30 font-mono text-xs rounded-r-md">
                          {selectedLog.new_values?.[key] !== undefined &&
                          selectedLog.new_values?.[key] !== null
                            ? formatAuditValue(key, selectedLog.new_values[key])
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  {Object.keys(selectedLog.new_values || {}).filter(
                    (key) =>
                      selectedLog.old_values?.[key] !==
                      selectedLog.new_values?.[key],
                  ).length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-8 text-center text-gray-400"
                      >
                        No field modifications tracked for this operation event.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AuditLogs;
