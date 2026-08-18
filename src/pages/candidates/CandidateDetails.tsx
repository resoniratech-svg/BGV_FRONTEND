import DashboardLayout from "../../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Lock,
} from "lucide-react";
import type { Candidate } from "../../types/Candidate";
import { generateReport, downloadReport } from "../../api/reportApi";
import {
  getCandidateById,
  updateCandidateStatusApi,
} from "../../api/candidateApi";
import { getVerificationSummary } from "../../api/verificationSummaryApi";

function CandidateDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [verificationSummary, setVerificationSummary] = useState<any>(null);

  const fetchCandidates = async () => {
    try {
      const data = await getCandidateById(Number(id));
      setCandidate(data);
    } catch (error) {
      console.error("Error fetching candidate:", error);
    }
  };

  const fetchVerificationSummary = async () => {
    try {
      const data = await getVerificationSummary(Number(id));
      console.log("verificationSummary payload:", data);
      setVerificationSummary(data);
    } catch (error) {
      console.error("Summary Error", error);
    }
  };
  useEffect(() => {
    if (!id) return;

    fetchCandidates();
    fetchVerificationSummary();
  }, [id]);
  // Real-Time Refresh Polling Loop (Every 5 seconds)
  // useEffect(() => {
  //   if (!id) return;

  //   fetchCandidates();
  //   fetchVerificationSummary();

  //   const interval = setInterval(() => {
  //     fetchCandidates();
  //     fetchVerificationSummary();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [id]);

  if (!candidate) {
    return (
      <DashboardLayout>
        <div className="p-10">Loading candidate...</div>
      </DashboardLayout>
    );
  }

  const handleSendRequest = async () => {
    try {
      await updateCandidateStatusApi(candidate.id, {
        status: "REQUEST_SENT",
        progress: 20,
      });
      fetchCandidates();
      alert(`Verification REQUEST_SENT to ${candidate.full_name}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await generateReport(candidate.id);
      alert(`Report generated successfully.\n${response.file_path}`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate report");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await downloadReport(candidate.id);
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const disposition = response.headers["content-disposition"];
      let filename = `bgv_report_${candidate.id}.pdf`;

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
    } catch (error: any) {
      console.log("DOWNLOAD ERROR", error);
      alert("Download failed");
    }
  };

  const getOverviewData = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          systemStatus: "Not Started",
          docCount: "0 / 6",
          pendingItems: "All Modules Pending",
        };
      case "REQUEST_SENT":
        return {
          systemStatus: "Waiting For Documents",
          docCount: "0 / 6",
          pendingItems: "Awaiting Uploads",
        };
      case "DOCUMENTS_UPLOADED":
        return {
          systemStatus: "Documents Received",
          docCount: "6 / 6",
          pendingItems: "Ready for Queue",
        };
      case "UNDER_VERIFICATION":
        return {
          systemStatus: "Verification Running",
          docCount: "6 / 6",
          pendingItems: "Processing Engine",
        };
      case "Verified":
      case "VERIFIED":
        return {
          systemStatus: "Completed",
          docCount: "6 / 6",
          pendingItems: "None - Safe",
        };
      case "Fraud Alert":
      case "FRAUD_ALERT":
        return {
          systemStatus: "Failed",
          docCount: "6 / 6",
          pendingItems: "Discrepancy Found",
        };
      case "Rejected":
      case "REJECTED":
        return {
          systemStatus: "Rejected",
          docCount: "Review Failed",
          pendingItems: "Application Dropped",
        };
      default:
        return {
          systemStatus: "Not Started",
          docCount: "0 / 6",
          pendingItems: "Incomplete Phase",
        };
    }
  };

  const overview = getOverviewData(candidate.status);

  // Business Rules for Disabling Modules Grid
  const isWorkflowDisabled = ["PENDING", "REQUEST_SENT"].includes(
    candidate.status,
  );

  const canGenerateReport = [
    "DOCUMENTS_UPLOADED",
    "UNDER_VERIFICATION",
    "VERIFIED",
    "FRAUD_ALERT",
  ].includes(candidate.status);

  const canDownloadReport = [
    "UNDER_VERIFICATION",
    "VERIFIED",
    "FRAUD_ALERT",
  ].includes(candidate.status);

  const fallbackName =
    `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() ||
    "Unknown Candidate";

  // Real-time API Sourced Module Status Map
  const moduleStatuses = {
    Aadhaar: verificationSummary?.aadhaar_status,
    PAN: verificationSummary?.pan_status,
    Passport: verificationSummary?.passport_status,
    "Driving License": verificationSummary?.dl_status,
    "Face Match": verificationSummary?.face_match_status,
    "Deepfake Detection": verificationSummary?.deepfake_status,
    "Resume Parsing": verificationSummary?.resume_status,
    Education: verificationSummary?.education_status,
    Employment: verificationSummary?.employment_status,
    "Salary Slip": verificationSummary?.salary_slip_status,
    "Credit Bureau": verificationSummary?.credit_status,
    "Court Record": verificationSummary?.court_status,
    Watchlist: verificationSummary?.watchlist_status,
  };

  const verificationModules = [
    {
      label: "Aadhaar Status",
      key: "Aadhaar",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "PAN Card Status",
      key: "PAN",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Passport Status",
      key: "Passport",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Driving License",
      key: "Driving License",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Face Match",
      key: "Face Match",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Deepfake Detection",
      key: "Deepfake Detection",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Resume Parsing",
      key: "Resume Parsing",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Education",
      key: "Education",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Employment",
      key: "Employment",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Salary Slip",
      key: "Salary Slip",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Credit Bureau",
      key: "Credit Bureau",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Court Record",
      key: "Court Record",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
    {
      label: "Watchlist",
      key: "Watchlist",
      onClick: () =>
        navigate(`/verification/candidate/${candidate.id}`, {
          state: { from: "candidate-profile" },
        }),
    },
  ];

  const renderStatusBox = (
    label: string,
    status: string,
    onClick?: () => void,
  ) => {
    const isVerified = status === "Verified" || status === "VERIFIED";
    const isFraud =
      status === "Fraud" ||
      status === "Fraud Alert" ||
      status === "FRAUD_ALERT";
    const isRejected = status === "Rejected" || status === "REJECTED";
    const isNotVerified = status === "Not Verified";

    let bgClass = "bg-gray-50/50 border-gray-100 hover:border-gray-300";
    let textClass = "text-gray-900";

    if (isVerified) {
      bgClass = "bg-[#DCFCE7] border-[#86EFAC] hover:border-[#4ADE80]";
      textClass = "text-[#166534]";
    } else if (isFraud) {
      bgClass = "bg-[#FEE2E2] border-[#FCA5A5] hover:border-[#F87171]";
      textClass = "text-[#991B1B]";
    } else if (isRejected) {
      bgClass = "bg-[#FFEDD5] border-[#FDBA74] hover:border-[#FB923C]";
      textClass = "text-[#9A3412]";
    } else if (isNotVerified) {
      bgClass = "bg-yellow-50 border-yellow-200 hover:border-yellow-300";
      textClass = "text-yellow-700";
    }

    // Dynamic layout styles if the parent container context is locked out
    if (isWorkflowDisabled) {
      bgClass = "bg-gray-50/40 border-gray-100 cursor-not-allowed opacity-75";
      textClass = "text-gray-400";
    }

    return (
      <button
        key={label}
        onClick={isWorkflowDisabled ? undefined : onClick}
        disabled={isWorkflowDisabled}
        className={`text-left p-4 rounded-xl border ${bgClass} transition-all duration-300 ${!isWorkflowDisabled ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : ""} focus:outline-none`}
      >
        <span className="text-gray-400 font-medium block mb-1">{label}:</span>

        <div className={`flex items-center gap-2 font-bold ${textClass}`}>
          {isVerified && <CheckCircle size={18} />}
          {isFraud && <XCircle size={18} />}
          {isNotVerified && <AlertTriangle size={18} />}
          {isRejected && (
            <AlertTriangle size={18} className="text-orange-600" />
          )}
          {(status === "Not Started" || isWorkflowDisabled) && (
            <Clock size={18} />
          )}
          <span>{isWorkflowDisabled ? "Not Started" : status}</span>
        </div>
      </button>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto pb-12">
        {/* Back Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/candidates")}
            className="p-3 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm text-gray-600 hover:text-gray-900 transition-all"
            title="Back to Candidates List"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Candidate Profile
          </h1>
        </div>

        {/* Candidate Summary Block */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-[#5B5FEF] flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-[#5B5FEF]/10">
                {(candidate.full_name || fallbackName).charAt(0)}
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">
                  {candidate.full_name || fallbackName}
                </h2>
                <p className="text-lg text-gray-500 mt-2">{candidate.email}</p>
                <p className="text-gray-400 mt-1">{candidate.phone}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <span
                className={`px-5 py-3 rounded-2xl font-semibold text-sm ${
                  candidate.status === "VERIFIED"
                    ? "bg-green-100 text-green-600"
                    : candidate.status === "REJECTED"
                      ? "bg-orange-100 text-orange-600"
                      : candidate.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-600"
                        : candidate.status === "REQUEST_SENT"
                          ? "bg-blue-100 text-blue-600"
                          : candidate.status === "DOCUMENTS_UPLOADED"
                            ? "bg-indigo-100 text-indigo-600"
                            : candidate.status === "UNDER_VERIFICATION"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-red-100 text-red-600"
                }`}
              >
                {candidate.status === "REQUEST_SENT"
                  ? "Verification REQUEST_SENT"
                  : candidate.status}
              </span>

              {candidate.status === "PENDING" && (
                <button
                  onClick={handleSendRequest}
                  className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-6 py-3 rounded-2xl font-medium shadow-lg shadow-[#5B5FEF]/10 transition-all"
                >
                  Send Verification Request
                </button>
              )}
              {candidate.status === "REQUEST_SENT" && (
                <div className="flex flex-col gap-2 items-end mt-2">
                  <button
                    onClick={() =>
                      window.open(`/portal/${candidate.id}`, "_blank")
                    }
                    className="text-sm font-bold text-[#5B5FEF] hover:text-[#4B4FD8] transition-all underline"
                  >
                    Open Portal (Test View)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Workflow Progress Pipeline */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Verification Workflow Progression
          </h2>
          <div className="flex flex-wrap gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${candidate.status === "REQUEST_SENT" ? "bg-blue-600 text-white shadow-sm" : "bg-blue-50 text-blue-600 border border-blue-100"}`}
            >
              REQUEST_SENT
            </span>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${candidate.status === "DOCUMENTS_UPLOADED" ? "bg-indigo-600 text-white shadow-sm" : "bg-indigo-50 text-indigo-600 border border-indigo-100"}`}
            >
              DOCUMENTS_UPLOADED
            </span>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${candidate.status === "UNDER_VERIFICATION" ? "bg-purple-600 text-white shadow-sm" : "bg-purple-50 text-purple-600 border border-purple-100"}`}
            >
              UNDER_VERIFICATION
            </span>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${candidate.status === "VERIFIED" ? "bg-green-600 text-white shadow-sm" : "bg-green-50 text-green-600 border border-green-100"}`}
            >
              Verified
            </span>
          </div>
        </div>

        {/* Verification Metrics Overview Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Pipeline Status</p>
            <h2
              className={`text-xl font-bold mt-4 ${
                candidate.status === "VERIFIED"
                  ? "text-green-600"
                  : candidate.status === "REJECTED"
                    ? "text-orange-600"
                    : candidate.status === "FRAUD_ALERT"
                      ? "text-red-500"
                      : "text-yellow-500"
              }`}
            >
              {overview.systemStatus}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Overall Progress
            </p>
            <h2 className="text-3xl font-bold text-[#5B5FEF] mt-4">
              {candidate.progress ?? 0}%
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Ingested Documents
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              {overview.docCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Active Queue Review
            </p>
            <h2
              className="text-sm font-bold text-red-500 mt-5 truncate"
              title={overview.pendingItems}
            >
              {overview.pendingItems}
            </h2>
          </div>
        </div>

        {/* Individual Verification Statuses Module Panel */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Verification Modules Real-time Status
            </h2>

            {/* Added system notification badge when panel execution steps are locked out */}
            {isWorkflowDisabled && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-semibold animate-pulse">
                <Lock size={14} />
                <span>Awaiting Document Ingestion</span>
              </div>
            )}
          </div>

          {/* Conditional layout wrapper adjusting visual opacity based on workflow state validation */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm text-gray-700 transition-opacity duration-300 ${isWorkflowDisabled ? "opacity-60 select-none pointer-events-none" : ""}`}
          >
            {verificationModules.map((module) => {
              const status =
                moduleStatuses[module.key as keyof typeof moduleStatuses] ||
                "Not Started";
              return renderStatusBox(module.label, status, module.onClick);
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => navigate(`/uploads/${candidate.id}`)}
              className="flex items-center justify-between bg-[#F5F7FB] hover:bg-gray-100 text-gray-800 px-6 py-4 rounded-2xl font-semibold transition-all group border border-transparent w-full sm:w-auto text-sm"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <span>Uploaded Documents Folder</span>
              </div>
            </button>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleGenerateReport}
                disabled={!canGenerateReport}
                className={`px-6 py-4 rounded-2xl font-semibold shadow-md transition-all text-sm ${
                  canGenerateReport
                    ? "bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                Generate Report
              </button>

              <button
                onClick={handleDownloadReport}
                disabled={!canDownloadReport}
                className={`px-6 py-4 rounded-2xl font-semibold shadow-md transition-all text-sm ${
                  canDownloadReport
                    ? "bg-gray-900 hover:bg-black text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Final Verification Result Badge Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Final Verification Workflow Outcome
          </h2>
          <div className="flex items-center gap-3">
            <span
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xs border ${
                candidate.status === "VERIFIED"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : candidate.status === "REJECTED"
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : candidate.status === "UNDER_VERIFICATION"
                      ? "bg-gray-100 text-gray-700 border-gray-200"
                      : candidate.status === "FRAUD_ALERT"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              System Level Result Status: {candidate.status}
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CandidateDetails;
