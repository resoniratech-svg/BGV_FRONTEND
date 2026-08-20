import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShieldAlert,
  CheckCircle,
  Clock,
  AlertTriangle,
  Cpu,
  ScanFace,
  FileWarning,
  Eye,
  XCircle,
} from "lucide-react";
import { getFraudCases } from "../../api/fraudApi";

// Strict Structural Interface Contracts
interface FraudCase {
  candidate_id: number;
  candidate_name: string;
  module: string;
  risk_level: string;
  status: string;
}

type FraudFilterType =
  | "ALL"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "REJECTED"
  | "FRAUD";

function FraudCenter() {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fraudCases, setFraudCases] = useState<FraudCase[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Added active state filter for grid metrics
  const [activeFilter, setActiveFilter] = useState<FraudFilterType>("ALL");

  useEffect(() => {
    const loadFraudCases = async () => {
      try {
        const response = await getFraudCases();
        console.log(response);
        setFraudCases(response.data || []);
      } catch (error) {
        console.error("Failed to load fraud cases", error);
      } finally {
        setLoading(false);
      }
    };
    loadFraudCases();
  }, []);

  // 2. Extracted counter metrics cleanly from the dataset
  const totalCases = fraudCases.length;

  const underReviewCount = fraudCases.filter(
    (item) =>
      item.status === "UNDER_REVIEW" ||
      item.status === "SUSPECTED" ||
      item.status === "PENDING",
  ).length;

  const resolvedCount = fraudCases.filter(
    (item) =>
      item.status === "RESOLVED" ||
      item.status === "CLEARED" ||
      item.status === "VERIFIED",
  ).length;

  const rejectedCount = fraudCases.filter(
    (item) => (item.status || "").toUpperCase() === "REJECTED",
  ).length;

  const fraudCount = fraudCases.filter(
    (item) => (item.status || "").toUpperCase() === "FRAUD",
  ).length;

  // Integrated breakdown counters to match the explicit strings returned from the DB UNION repository layer
  const ocrMismatchesTotal = fraudCases.filter(
    (item) =>
      item.module === "OCR Verification" ||
      item.module === "Salary Slip Verification" ||
      item.module === "PAN Verification",
  ).length;

  const faceSpoofsTotal = fraudCases.filter(
    (item) =>
      item.module === "Face Match" || item.module === "Deepfake Detection",
  ).length;

  const genericAnomaliesCount =
    totalCases - ocrMismatchesTotal - faceSpoofsTotal;

  // 3. Multi-layer filtering sequence processing text string searches AND card selection
  const filteredCases = fraudCases.filter((item) => {
    // Stage A: Text Query Evaluation
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (item.candidate_name || "").toLowerCase().includes(query) ||
      (item.module || "").toLowerCase().includes(query) ||
      (item.risk_level || "").toLowerCase().includes(query) ||
      (item.status || "").toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // Stage B: Card UI State Classification
    const statusUpper = (item.status || "").toUpperCase();
    switch (activeFilter) {
      case "UNDER_REVIEW":
        return (
          statusUpper === "UNDER_REVIEW" ||
          statusUpper === "SUSPECTED" ||
          statusUpper === "PENDING"
        );
      case "RESOLVED":
        return (
          statusUpper === "RESOLVED" ||
          statusUpper === "CLEARED" ||
          statusUpper === "VERIFIED"
        );
      case "REJECTED":
        return statusUpper === "REJECTED";
      case "FRAUD":
        return statusUpper === "FRAUD";
      case "ALL":
      default:
        return true;
    }
  });
  const displayedCases = showAll ? filteredCases : filteredCases.slice(0, 10);
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 font-medium text-gray-500 animate-pulse">
          Loading fraud cases...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header Block Row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-gray-900 text-4xl font-bold">Fraud Center</h1>
            <p className="text-gray-500 mt-2">
              AI-powered risk intelligence, forgery screening, and compliance
              monitoring
            </p>
          </div>

          <div className="bg-red-50 text-red-700 border border-red-100 px-5 py-4 rounded-2xl font-semibold text-sm shadow-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>
              Risk Audits isolate background check profile failure cases
              automatically
            </span>
          </div>
        </div>

        {/* Dynamic Analytics Counters Grid Row - 5 Columns for all metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Fraud Cases */}
          <div
            onClick={() => setActiveFilter("ALL")}
            className={`bg-white p-5 rounded-3xl border cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-between ${
              activeFilter === "ALL"
                ? "border-gray-400 ring-2 ring-gray-400/10 bg-gray-50/30"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Cases
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                {totalCases}
              </h2>
            </div>
            <div
              className={`p-3 rounded-2xl transition-transform ${activeFilter === "ALL" ? "scale-110 bg-gray-200 text-gray-700" : "bg-gray-50 text-gray-400"}`}
            >
              <FileWarning className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Under Review */}
          <div
            onClick={() => setActiveFilter("UNDER_REVIEW")}
            className={`bg-white p-5 rounded-3xl border cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-between ${
              activeFilter === "UNDER_REVIEW"
                ? "border-yellow-500 ring-2 ring-yellow-500/10 bg-yellow-50/20"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Under Review
              </p>
              <h2 className="text-3xl font-extrabold text-yellow-500 mt-2">
                {underReviewCount}
              </h2>
            </div>
            <div
              className={`p-3 rounded-2xl transition-transform ${activeFilter === "UNDER_REVIEW" ? "scale-110 bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-500"}`}
            >
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Resolved */}
          <div
            onClick={() => setActiveFilter("RESOLVED")}
            className={`bg-white p-5 rounded-3xl border cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-between ${
              activeFilter === "RESOLVED"
                ? "border-green-500 ring-2 ring-green-500/10 bg-green-50/20"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Resolved
              </p>
              <h2 className="text-3xl font-extrabold text-green-500 mt-2">
                {resolvedCount}
              </h2>
            </div>
            <div
              className={`p-3 rounded-2xl transition-transform ${activeFilter === "RESOLVED" ? "scale-110 bg-green-500 text-white" : "bg-green-50 text-green-500"}`}
            >
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Rejected */}
          <div
            onClick={() => setActiveFilter("REJECTED")}
            className={`bg-white p-5 rounded-3xl border cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-between ${
              activeFilter === "REJECTED"
                ? "border-orange-500 ring-2 ring-orange-500/10 bg-orange-50/20"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rejected
              </p>
              <h2 className="text-3xl font-extrabold text-orange-600 mt-2">
                {rejectedCount}
              </h2>
            </div>
            <div
              className={`p-3 rounded-2xl transition-transform ${activeFilter === "REJECTED" ? "scale-110 bg-orange-500 text-white" : "bg-gray-50 text-orange-500"}`}
            >
              <XCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Card 5: Confirmed Fraud */}
          <div
            onClick={() => setActiveFilter("FRAUD")}
            className={`bg-white p-5 rounded-3xl border cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-between ${
              activeFilter === "FRAUD"
                ? "border-red-600 ring-2 ring-red-600/10 bg-red-50/30"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Confirmed Fraud
              </p>
              <h2 className="text-3xl font-extrabold text-red-600 mt-2">
                {fraudCount}
              </h2>
            </div>
            <div
              className={`p-3 rounded-2xl transition-transform ${activeFilter === "FRAUD" ? "scale-110 bg-red-600 text-white" : "bg-red-50 text-red-600"}`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* AI Fraud Analysis Ingestion Insights Block Panel */}
        <div
          className="
sticky
top-4
z-20
bg-white
rounded-3xl
border
border-gray-100
shadow-sm
p-8
space-y-6
"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              AI Component Discrepancy Breakdown
            </h2>
            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-md">
              Distribution Metrics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-red-700 font-bold text-sm">
                  Registry Form Violations
                </p>
                <h3 className="text-3xl font-black text-red-800 mt-2">
                  {genericAnomaliesCount}
                </h3>
              </div>
              <div className="p-2 bg-white/60 text-red-600 rounded-xl">
                <Cpu className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-yellow-700 font-bold text-sm">
                  OCR Text Mismatches
                </p>
                <h3 className="text-3xl font-black text-yellow-800 mt-2">
                  {ocrMismatchesTotal}
                </h3>
              </div>
              <div className="p-2 bg-white/60 text-yellow-600 rounded-xl">
                <FileWarning className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-bold text-sm">
                  Face Spoof Attempts
                </p>
                <h3 className="text-3xl font-black text-blue-800 mt-2">
                  {faceSpoofsTotal}
                </h3>
              </div>
              <div className="p-2 bg-white/60 text-blue-600 rounded-xl">
                <ScanFace className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Fraud Cases Table Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Filtering Control Row Header Bar */}
          <div
            className="
sticky
top-4
z-30
bg-white
p-6
border-b
border-gray-100
flex
items-center
justify-between
flex-wrap
gap-4
"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Fraud Cases{" "}
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
                placeholder="Search fraud cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F5F7FB] border border-gray-200 rounded-2xl pl-11 pr-5 py-3.5 outline-none w-full sm:w-[320px] focus:bg-white focus:border-[#5B5FEF] transition-all text-sm text-gray-900"
              />
            </div>
          </div>

          {/* Core Table Layout Grid */}
          <div className="overflow-auto max-h-[650px]">
            <table className="w-full min-w-[850px]">
              <thead className="sticky top-0 z-20 bg-[#F8FAFC]">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">
                    Candidate ID
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">
                    Candidate
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">
                    Fraud Module
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">
                    Risk Level
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs">
                    Status
                  </th>
                  <th className="text-center p-6 text-gray-500 font-semibold text-xs">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredCases.length > 0 ? (
                  displayedCases.map((item: FraudCase, index: number) => (
                    <tr
                      key={item.candidate_id || index}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="p-6 font-bold text-gray-900 text-sm tracking-tight">
                        {item.candidate_id}
                      </td>
                      <td className="p-6 text-sm text-gray-800 font-semibold">
                        {item.candidate_name}
                      </td>
                      <td className="p-6 text-sm font-medium">
                        <span className="font-semibold text-red-600">
                          {item.module}
                        </span>
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block ${
                            item.risk_level === "HIGH"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : item.risk_level === "MEDIUM"
                                ? "bg-orange-100 text-orange-700 border-orange-200"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {item.risk_level}
                        </span>
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block ${
                            item.status === "FRAUD"
                              ? "bg-red-600 text-white border-red-700"
                              : item.status === "REJECTED"
                                ? "bg-orange-100 text-orange-700 border-orange-200"
                                : item.status === "RESOLVED" ||
                                    item.status === "CLEARED" ||
                                    item.status === "VERIFIED"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/fraud/${item.candidate_id}`,

                                {
                                  state: {
                                    module: item.module,
                                  },
                                },
                              )
                            }
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold border border-red-200 flex items-center gap-1.5 transition-all"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Investigate
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/candidates/${item.candidate_id}`)
                            }
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
                    <td
                      colSpan={6}
                      className="p-16 text-center text-gray-400 font-medium text-sm"
                    >
                      No active candidate security records match your specified
                      search parameter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredCases.length > 10 && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="
flex
items-center
gap-1
text-sm
font-semibold
text-red-600
hover:text-red-800
transition-colors
"
                >
                  {showAll ? (
                    <>
                      Show Less
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      View All ({filteredCases.length})
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

export default FraudCenter;
