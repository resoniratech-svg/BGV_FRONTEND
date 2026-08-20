import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  getFraudCase,
  approveFraudCase,
  rejectFraudCase,
  requestReverification
} from "../../api/fraudApi";

function FraudInvestigation() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedModule = location.state?.module;
  const [candidate, setCandidate] = useState<any>(null);

  useEffect(() => {
    loadCandidate();
  }, [candidateId]);

  const loadCandidate = async () => {
    const response = await getFraudCase(Number(candidateId));
    setCandidate(response);
  };

  const handleApprove = async () => {

await approveFraudCase(

Number(candidateId),

selectedModule

);

await loadCandidate();

};



const handleReject = async () => {

await rejectFraudCase(

Number(candidateId),

selectedModule

);

await loadCandidate();

};

  const handleReverify = async () => {
    await requestReverification(Number(candidateId), selectedModule);
    navigate(`/verification/candidate/${candidateId}`, {
      state: { reverify: true }
    });
  };

  if (!candidate) {
    return (
      <DashboardLayout>
        <div className="p-10">Loading...</div>
      </DashboardLayout>
    );
  }

  const moduleMappings = [
    ["aadhaar_status", "Aadhaar"],
    ["pan_status", "PAN"],
    ["passport_status", "Passport"],
    ["face_match_status", "Face Match"],
    ["resume_status", "Resume Parsing"],
    ["education_status", "Education"],
    ["employment_status", "Employment"],
    ["credit_status", "Credit Bureau"],
    ["court_status", "Court Record"],
    ["watchlist_status", "Watchlist"],
    ["dl_status", "Driving License"],
    ["deepfake_status", "Deepfake"],
    ["salary_slip_status", "Salary Slip"]
  ];

  const failedModules = moduleMappings

.map(

([key,label])=>({

name:label,

status:candidate[key]

})

)

.filter(

module => {

const status = module.status?.toUpperCase();

return [

"FRAUD",

"REJECTED",

"PENDING_REVIEW"

].includes(status);

}

);

  const timeline = [
    {
      title: "Case Created",
      value: candidate.created_at
        ? new Date(candidate.created_at).toLocaleString()
        : "Not Available"
    },
    {
      title: "Last Modified",
      value: candidate.updated_at
        ? new Date(candidate.updated_at).toLocaleString()
        : "Not Available"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-8 flex flex-col gap-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          {/* Back Button and Title Row */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-600 group-hover:text-gray-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength="1"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <h1 className="text-3xl font-bold">Fraud Investigation</h1>
          </div>
          
          <p className="text-sm text-gray-500 ml-11">
            Candidate ID : {candidate.candidate_id}
          </p>
        </div>

        <hr />

        <div className="bg-white rounded-3xl p-8 shadow-sm border">
          <h2 className="text-2xl font-bold mb-6">Candidate Information</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">Investigating Module</p>
            <p className="font-semibold text-red-600">{selectedModule}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold">{candidate.candidate_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Candidate ID</p>
              <p className="font-semibold">{candidate.candidate_id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Risk Level</p>
              <p className="font-semibold">{candidate.risk_level}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Overall Status</p>
              <p
                className={`font-bold ${
                  candidate.overall_status === "VERIFIED"
                    ? "text-green-600"
                    : candidate.overall_status === "REJECTED"
                    ? "text-red-600"
                    : "text-amber-600"
                }`}
              >
                {candidate.overall_status}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border">
          <h2 className="font-bold text-xl mb-4">Failed Modules</h2>
          <table className="w-full">
            <tbody>
              {failedModules.length > 0 ? (
                failedModules.map((module, index) => (
                  <tr key={index}>
                    <td className="py-4">{module.name}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          module.status?.toUpperCase() === "FRAUD"
                            ? "bg-red-50 text-red-600"
                            : module.status?.toUpperCase() === "REJECTED"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {module.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-6 text-gray-400">
                    No failed modules found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Timeline</h2>
          {timeline.map((item, index) => (
            <div key={index} className="mb-3">
              <div className="font-semibold">{item.title}</div>
              <div className="text-gray-500">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Provider Response</h2>
          <pre className="bg-gray-900 text-green-400 p-6 rounded-2xl overflow-auto">
            {JSON.stringify(candidate, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            Approve
          </button>

          <button
            onClick={handleReject}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            Reject
          </button>

          <button
            onClick={handleReverify}
            className="px-6 py-3 bg-gray-200 rounded-xl"
          >
            Request Reverification
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default FraudInvestigation;