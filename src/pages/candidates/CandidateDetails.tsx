import DashboardLayout from "../../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft,  FileText } from "lucide-react";
import type { Candidate } from "../../types/Candidate"; // <-- Global Type Import

const DEFAULT_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    status: "Verified",
    role: "Software Engineer",
    progress: 100,
    aadhaarStatus: "Completed",
    panStatus: "Completed",
    passportStatus: "Completed",
    dlStatus: "Completed",
    faceMatchStatus: "Completed",
    fraudStatus: "Passed",
  },
  {
    id: 2,
    name: "Priya Reddy",
    email: "priya@example.com",
    status: "Pending",
    role: "Data Analyst",
    progress: 0,
    aadhaarStatus: "Not Started",
    panStatus: "Not Started",
    passportStatus: "Not Started",
    dlStatus: "Not Started",
    faceMatchStatus: "Not Started",
    fraudStatus: "Not Started",
  },
  {
    id: 3,
    name: "Arjun Patel",
    email: "arjun@example.com",
    status: "Fraud Alert",
    role: "UI/UX Designer",
    progress: 70,
    aadhaarStatus: "Completed",
    panStatus: "Completed",
    passportStatus: "Pending",
    dlStatus: "Completed",
    faceMatchStatus: "Failed",
    fraudStatus: "Alert triggered",
  },
];

function CandidateDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Ingest data dynamically from localStorage with standard react local vectors
  const [candidateList, setCandidateList] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem("candidates");
    return saved ? JSON.parse(saved) : DEFAULT_CANDIDATES;
  });

  // Extract matching candidate details safely
  const candidate = candidateList.find((c) => String(c.id) === String(id)) ?? DEFAULT_CANDIDATES[0];

  const handleSendRequest = () => {
    const updatedCandidates = candidateList.map((c) =>
      c.id === candidate.id
        ? {
            ...c,
            status: "Request Sent",
            progress: 20,
          }
        : c
    );

    localStorage.setItem("candidates", JSON.stringify(updatedCandidates));
    setCandidateList(updatedCandidates);
    alert(`Verification request sent to ${candidate.name || "candidate"}`);
  };

  // Helper to dynamically extract structural copy for Overview Cards based on status Workflow
  const getOverviewData = (status: string) => {
    switch (status) {
      case "Pending":
        return { systemStatus: "Not Started", docCount: "0 / 6", pendingItems: "All Modules Pending" };
      case "Request Sent":
        return { systemStatus: "Waiting For Documents", docCount: "0 / 6", pendingItems: "Awaiting Uploads" };
      case "Documents Uploaded":
        return { systemStatus: "Documents Received", docCount: "6 / 6", pendingItems: "Ready for Queue" };
      case "Under Verification":
        return { systemStatus: "Verification Running", docCount: "6 / 6", pendingItems: "Processing Engine" };
      case "Verified":
        return { systemStatus: "Completed", docCount: "6 / 6", pendingItems: "None - Safe" };
      case "Fraud Alert":
        return { systemStatus: "Failed", docCount: "6 / 6", pendingItems: "Discrepancy Found" };
      case "Rejected":
        return { systemStatus: "Rejected", docCount: "Review Failed", pendingItems: "Application Dropped" };
      default:
        return { systemStatus: "Not Started", docCount: "0 / 6", pendingItems: "Incomplete Phase" };
    }
  };

  const overview = getOverviewData(candidate.status);
  const fallbackName = `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "Unknown Candidate";

  const verificationModules = [
    { label: "Aadhaar Status", key: "Aadhaar", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "PAN Card Status", key: "PAN", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Passport Status", key: "Passport", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Driving License", key: "Driving License", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Face Match", key: "Face Match", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "OCR Verification", key: "OCR Verification", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Deepfake Detection", key: "Deepfake Detection", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Resume Parsing", key: "Resume Parsing", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Education", key: "Education", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Employment", key: "Employment", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Salary Slip", key: "Salary Slip", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Credit Bureau", key: "Credit Bureau", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Court Record", key: "Court Record", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Watchlist", key: "Watchlist", onClick: () => navigate(`/verification/candidate/${candidate.id}`) },
    { label: "Fraud Center Scans", key: "Fraud", isFraud: true, onClick: () => navigate("/fraud-center") }
  ];

  const renderStatusBox = (label: string, status: string, isFraudBox = false, onClick?: () => void) => {
    const isVerified = status === "Verified";
    const isFraud = status === "Fraud" || status === "Fraud Alert";
    const isRejected = status === "Rejected";
    
    let bgClass = "bg-gray-50/50 border-gray-100 hover:border-gray-300";
    let textClass = "text-gray-900";
    
    if (isVerified) {
      bgClass = "bg-[#DCFCE7] border-[#86EFAC] hover:border-[#4ADE80]";
      textClass = "text-[#166534]";
    } else if (isFraud || (isFraudBox && candidate.status === "Fraud Alert")) {
      bgClass = "bg-[#FEE2E2] border-[#FCA5A5] hover:border-[#F87171]";
      textClass = "text-[#991B1B]";
    } else if (isRejected) {
      bgClass = "bg-[#FFEDD5] border-[#FDBA74] hover:border-[#FB923C]";
      textClass = "text-[#9A3412]";
    }

    return (
      <button 
        key={label} 
        onClick={onClick}
        className={`text-left p-4 rounded-xl border ${bgClass} transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer focus:outline-none`}
      >
        <span className="text-gray-500 font-medium block mb-1">{label}:</span>
        <strong className={`font-bold ${textClass}`}>{status}</strong>
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
          <h1 className="text-3xl font-bold text-gray-900">Candidate Profile</h1>
        </div>

        {/* Candidate Summary Block */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-[#5B5FEF] flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-[#5B5FEF]/10">
                {(candidate.name || fallbackName).charAt(0)}
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900">{candidate.name || fallbackName}</h2>
                <p className="text-lg text-gray-500 mt-2">{candidate.email}</p>
                <p className="text-gray-400 mt-1">{candidate.role || "Associate Track"}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <span
                className={`px-5 py-3 rounded-2xl font-semibold text-sm ${
                  candidate.status === "Verified"
                    ? "bg-green-100 text-green-600"
                    : candidate.status === "Pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : candidate.status === "Request Sent"
                    ? "bg-blue-100 text-blue-600"
                    : candidate.status === "Documents Uploaded"
                    ? "bg-indigo-100 text-indigo-600"
                    : candidate.status === "Under Verification"
                    ? "bg-purple-100 text-purple-600"
                    : candidate.status === "Rejected"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {candidate.status === "Request Sent" ? "Verification Request Sent" : candidate.status}
              </span>

              {candidate.status === "Pending" && (
                <button
                  onClick={handleSendRequest}
                  className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-6 py-3 rounded-2xl font-medium shadow-lg shadow-[#5B5FEF]/10 transition-all"
                >
                  Send Verification Request
                </button>
              )}
              {candidate.status === "Request Sent" && (
                <div className="flex flex-col gap-2 items-end mt-2">
                  <button
                    onClick={() => window.open(`/portal/${candidate.id}`, "_blank")}
                    className="text-sm font-bold text-[#5B5FEF] hover:text-[#4B4FD8] transition-all underline"
                  >
                    Open Portal (Test View)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Verification Workflow Progress Pipeline */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Verification Workflow Progression</h2>
          <div className="flex flex-wrap gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${candidate.status === "Request Sent" ? "bg-blue-600 text-white shadow-sm" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
              Request Sent
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${candidate.status === "Documents Uploaded" ? "bg-indigo-600 text-white shadow-sm" : "bg-indigo-50 text-indigo-600 border border-indigo-100"}`}>
              Documents Uploaded
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${candidate.status === "Under Verification" ? "bg-purple-600 text-white shadow-sm" : "bg-purple-50 text-purple-600 border border-purple-100"}`}>
              Under Verification
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${candidate.status === "Verified" ? "bg-green-600 text-white shadow-sm" : "bg-green-50 text-green-600 border border-green-100"}`}>
              Verified
            </span>
          </div>
        </div>

        {/* Verification Metrics Overview Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Pipeline Status</p>
            <h2 className={`text-xl font-bold mt-4 ${
              candidate.status === "Verified" ? "text-green-600" : candidate.status === "Fraud Alert" ? "text-red-500" : "text-yellow-500"
            }`}>
              {overview.systemStatus}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Overall Progress</p>
            <h2 className="text-3xl font-bold text-[#5B5FEF] mt-4">
              {candidate.progress ?? 0}%
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Ingested Documents</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">{overview.docCount}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Active Queue Review</p>
            <h2 className="text-sm font-bold text-red-500 mt-5 truncate" title={overview.pendingItems}>
              {overview.pendingItems}
            </h2>
          </div>
        </div>

        {/* 3. Show Individual Verification Statuses Module Panel */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Verification Modules Real-time Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm text-gray-700">
            {verificationModules.map((module) => {
              const modStatuses: Record<string, string> = candidate.moduleStatuses || {};
              const status = module.isFraud
                ? candidate.fraudStatus || modStatuses[module.key] || "Not Started"
                : modStatuses[module.key] || "Not Started";
              return renderStatusBox(module.label, status, module.isFraud, module.onClick);
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

            <button
              className="bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-semibold shadow-md transition-all text-sm w-full sm:w-auto"
              onClick={() => alert("Generating full background verification candidate ledger report summary compilation...")}
            >
              Download Ledger Report
            </button>
          </div>
        </div>



        {/* 6. Terminal Final Verification Result Badge Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Final Verification Workflow Outcome</h2>
          <div className="flex items-center gap-3">
            <span
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xs border ${
                candidate.status === "Verified" ? "bg-green-50 text-green-700 border-green-200" :
                candidate.status === "Rejected" ? "bg-gray-100 text-gray-700 border-gray-200" :
                candidate.status === "Fraud Alert" ? "bg-red-50 text-red-700 border-red-200" :
                "bg-yellow-50 text-yellow-700 border-yellow-200"
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