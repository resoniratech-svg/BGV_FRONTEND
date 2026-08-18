import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";
import {
  Search,
  Download,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useReports } from "../../hooks/useReports";
import { downloadReport, exportReports } from "../../api/reportApi";

type FilterType = "ALL" | "VERIFIED" | "PENDING" | "FRAUD";

function Reports() {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const { reports, loading, error } = useReports();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 font-medium text-gray-500 animate-pulse">
          Loading reports...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8 text-red-500 font-semibold bg-red-50 rounded-2xl border border-red-100 max-w-xl mx-auto mt-12 text-center">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats based on complete dataset
  const stats = {
    total: reports.length,
    verified: reports.filter((r) => r.verification_status === "VERIFIED")
      .length,
    pending: reports.filter(
      (r) =>
        r.verification_status === "INITIATED" ||
        r.verification_status === "IN_PROGRESS" ||
        r.verification_status === "PENDING_REVIEW",
    ).length,
    fraud: reports.filter(
      (r) =>
        r.verification_status === "REJECTED" ||
        r.verification_status === "FRAUD",
    ).length,
  };

  // Filter logic combining text search and active grid box state selection
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      (r.report_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.candidate_name || "").toLowerCase().includes(search.toLowerCase()) ||
      String(r.candidate_id || "").includes(search);

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "VERIFIED":
        return r.verification_status === "VERIFIED";
      case "PENDING":
        return (
          r.verification_status === "INITIATED" ||
          r.verification_status === "IN_PROGRESS" ||
          r.verification_status === "PENDING_REVIEW"
        );
      case "FRAUD":
        return (
          r.verification_status === "REJECTED" ||
          r.verification_status === "FRAUD"
        );
      case "ALL":
      default:
        return true;
    }
  });

  const displayedReports = showAll
    ? filteredReports
    : filteredReports.slice(0, 10);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
      case "FRAUD":
        return "bg-red-100 text-red-700 border-red-200";
      case "INITIATED":
      case "IN_PROGRESS":
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleDownloadReport = async (candidateId: number) => {
    try {
      const response = await downloadReport(candidateId);
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const disposition = response.headers["content-disposition"];
      let filename = `candidate_${candidateId}.pdf`;

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Unable to download report");
    }
  };
  const handleExportReports = async () => {
    try {
      const response = await exportReports();

      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "Verification_Reports.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert("Unable to export reports.");
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-gray-900 text-4xl font-bold">
              Verification Reports
            </h1>
            <p className="text-gray-500 mt-2">
              Candidate verification and fraud analysis audit reports
            </p>
          </div>
          <button
            onClick={handleExportReports}
            className="bg-[#5B5FEF] hover:bg-[#4B4FD8] transition-all text-white px-6 py-3 rounded-2xl shadow-lg font-medium flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Exports Reports
          </button>
        </div>

        {/* Operational Grid Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            label="Total Reports"
            value={stats.total}
            icon={<FileText />}
            colorClass="bg-indigo-50 text-indigo-500"
            isActive={activeFilter === "ALL"}
            onClick={() => setActiveFilter("ALL")}
          />
          <StatCard
            label="Verified"
            value={stats.verified}
            icon={<CheckCircle />}
            colorClass="bg-green-50 text-green-500"
            isActive={activeFilter === "VERIFIED"}
            onClick={() => setActiveFilter("VERIFIED")}
          />
          <StatCard
            label="Pending Review"
            value={stats.pending}
            icon={<Clock />}
            colorClass="bg-yellow-50 text-yellow-500"
            isActive={activeFilter === "PENDING"}
            onClick={() => setActiveFilter("PENDING")}
          />
          <StatCard
            label="Fraud Cases"
            value={stats.fraud}
            icon={<AlertTriangle />}
            colorClass="bg-red-50 text-red-500"
            isActive={activeFilter === "FRAUD"}
            onClick={() => setActiveFilter("FRAUD")}
          />
        </div>

        {/* Reports Table Grid Layout */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="sticky top-4 z-30 bg-white p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-gray-900 text-2xl font-semibold">
              Generated Reports{" "}
              {activeFilter !== "ALL" && (
                <span className="text-sm font-medium text-gray-400">
                  ({activeFilter} Filter Applied)
                </span>
              )}
            </h2>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search reports or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#F5F7FB] border border-gray-200 rounded-2xl pl-12 pr-5 py-3 w-[300px] outline-none focus:bg-white focus:border-[#5B5FEF] transition-all"
              />
            </div>
          </div>
          <div className="overflow-auto max-h-[650px]">
            <table className="w-full min-w-[800px]">
              <thead className="sticky top-0 z-20 bg-[#F8FAFC]">
                <tr>
                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">
                    Candidate ID
                  </th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">
                    Candidate Name
                  </th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">
                    Report Status
                  </th>
                  <th className="p-6 text-center text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.length > 0 ? (
                  displayedReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-6 font-semibold text-gray-900">
                        #{report.candidate_id}
                      </td>
                      <td className="p-6">
                        <p className="font-semibold text-gray-900">
                          {report.candidate_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {report.report_name}
                        </p>
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(report.verification_status)}`}
                        >
                          {report.verification_status}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/reports/view/${report.candidate_id}`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                          >
                            View Report
                          </Link>
                          <button
                            onClick={() =>
                              handleDownloadReport(report.candidate_id)
                            }
                            className="bg-indigo-50 hover:bg-[#5B5FEF] text-[#5B5FEF] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Download className="w-4 h-4" />
                            Download PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-16 text-center text-gray-400 font-medium"
                    >
                      No matching audit reports found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredReports.length > 10 && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {showAll ? (
                    <>
                      Show Less
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      View All ({filteredReports.length})
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  isActive: boolean;
  onClick: () => void;
}

const StatCard = ({
  label,
  value,
  icon,
  colorClass,
  isActive,
  onClick,
}: StatCardProps) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-3xl shadow-sm border cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-between ${
      isActive
        ? "border-[#5B5FEF] ring-2 ring-[#5B5FEF]/10 bg-indigo-50/10"
        : "border-gray-100 hover:border-gray-300"
    }`}
  >
    <div>
      <h2 className="text-gray-500 font-medium text-sm">{label}</h2>
      <p className="text-gray-900 text-4xl font-bold mt-2">{value}</p>
    </div>
    <div
      className={`p-4 rounded-2xl transition-transform ${colorClass} ${isActive ? "scale-110" : ""}`}
    >
      {icon}
    </div>
  </div>
);

export default Reports;
