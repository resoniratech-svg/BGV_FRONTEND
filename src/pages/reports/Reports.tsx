import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { Search, FileText, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react";
import { Link } from "react-router-dom";
import type { Candidate } from "../../types/Candidate";

function Reports() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("candidates");
    if (saved) setCandidates(JSON.parse(saved));
  }, []);

  const stats = {
    total: candidates.length,
    verified: candidates.filter(c => c.status === "Verified").length,
    pending: candidates.filter(c => c.status === "Under Verification" || c.status === "Documents Uploaded" || c.status === "Request Sent").length,
    fraud: candidates.filter(c => c.status === "Fraud Alert").length,
  };

  const filteredCandidates = candidates.filter(c => 
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-700 border-green-200";
      case "Fraud Alert":
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "Under Verification":
      case "Documents Uploaded":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-gray-900 text-4xl font-bold">Verification Reports</h1>
            <p className="text-gray-500 mt-2">Candidate verification and fraud analysis audit reports</p>
          </div>
          <button onClick={() => alert("Connecting to reporting engine...")} className="bg-[#5B5FEF] hover:bg-[#4B4FD8] transition-all text-white px-6 py-3 rounded-2xl shadow-lg font-medium flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Global Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="Total Reports" value={stats.total} icon={<FileText />} colorClass="bg-indigo-50 text-indigo-500" />
          <StatCard label="Verified" value={stats.verified} icon={<CheckCircle />} colorClass="bg-green-50 text-green-500" />
          <StatCard label="Pending Review" value={stats.pending} icon={<Clock />} colorClass="bg-yellow-50 text-yellow-500" />
          <StatCard label="Fraud Cases" value={stats.fraud} icon={<AlertTriangle />} colorClass="bg-red-50 text-red-500" />
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-gray-900 text-2xl font-semibold">Latest Audits</h2>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#F5F7FB] border border-gray-200 rounded-2xl pl-12 pr-5 py-3 w-[300px] outline-none focus:bg-white focus:border-[#5B5FEF] transition-all" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Candidate Target</th>
                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase">Report Status</th>
                  <th className="p-6 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCandidates.length > 0 ? filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6">
                      <p className="font-semibold text-gray-900">{c.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.email}</p>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-3">
                        <Link 
                          to={`/candidates/${c.id}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          View Profile
                        </Link>
                        <button 
                          onClick={() => alert(`Downloading highly-secure PDF report for ${c.name}...`)}
                          className="bg-indigo-50 hover:bg-[#5B5FEF] text-[#5B5FEF] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="p-16 text-center text-gray-400 font-medium">
                      No matching audit reports found.
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

const StatCard = ({ label, value, icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <h2 className="text-gray-500 font-medium text-sm">{label}</h2>
      <p className="text-gray-900 text-4xl font-bold mt-2">{value}</p>
    </div>
    <div className={`p-4 rounded-2xl ${colorClass}`}>{icon}</div>
  </div>
);

export default Reports;