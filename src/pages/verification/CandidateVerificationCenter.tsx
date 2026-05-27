import DashboardLayout from "../../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, XCircle, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

type VerificationStatus = "Verified" | "Fraud" | "Rejected";

function CandidateVerificationCenter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});
  
  // Track verified modules
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, VerificationStatus>>({});

  useEffect(() => {
    const saved = localStorage.getItem("candidates");
    const candidates = JSON.parse(saved || "[]");
    const found = candidates.find((c: any) => String(c.id) === id);
    if (found) {
      setCandidate(found);
      setModuleStatuses(found.moduleStatuses || {});
    }
  }, [id]);

  const modules = [
    { title: "Identity", items: ["Aadhaar", "PAN", "Passport", "Face Match"] },
    { title: "AI/OCR", items: ["OCR Verification", "Deepfake Detection", "Resume Parsing"] },
    { title: "Background", items: ["Education", "Employment", "Salary Slip", "Credit Bureau", "Court Record", "Watchlist"] }
  ];

  // Placeholder for future backend integration
  const callVerificationAPI = async (moduleName: string): Promise<VerificationStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // TODO: Replace with real `await fetch('api/verify/...')`
        // Backend should return "Original", "Fraud", or "Rejected"
        // For simulation, we assume Original -> "Verified"
        resolve("Verified"); 
      }, 1500);
    });
  };

  const handleVerify = async (moduleName: string) => {
    setVerifying((prev) => ({ ...prev, [moduleName]: true }));

    try {
      // 1. Call Backend API
      const resultStatus = await callVerificationAPI(moduleName);
      
      // 2. Update Local State
      const updatedStatuses = { ...moduleStatuses, [moduleName]: resultStatus };
      
      const hasFraudOrRejected = Object.values(updatedStatuses).some(s => s === "Fraud" || s === "Rejected");
      
      const saved = localStorage.getItem("candidates");
      const candidates: Candidate[] = JSON.parse(saved || "[]");
      
      const updatedCandidates = candidates.map(c => {
        if (String(c.id) === id) {
          // Determine mandatory modules dynamically based on country
          let mandatoryModules = modules[0].items; // Default fallback to all identity mods
          if (c.country && c.country.toLowerCase() === "india") {
            mandatoryModules = ["Aadhaar", "PAN", "Education"];
          }

          const mandatoryVerifiedCount = mandatoryModules.filter(m => updatedStatuses[m] === "Verified").length;
          const newProgress = Math.min(100, Math.round(40 + (mandatoryVerifiedCount * (60 / mandatoryModules.length))));
          let newStatus = c.status;
          
          if (hasFraudOrRejected) {
             newStatus = "Fraud Alert";
          } else if (mandatoryVerifiedCount === mandatoryModules.length) {
             newStatus = "Verified";
          } else if (Object.keys(updatedStatuses).length > 0 && newStatus !== "Verified") {
             newStatus = "Under Verification";
          }
          
          return { 
            ...c, 
            moduleStatuses: updatedStatuses,
            progress: newProgress,
            status: newStatus
          };
        }
        return c;
      });

      localStorage.setItem("candidates", JSON.stringify(updatedCandidates));
      setModuleStatuses(updatedStatuses);
    } catch (error) {
      console.error("Verification API failed:", error);
      alert("Failed to connect to verification server.");
    } finally {
      setVerifying((prev) => ({ ...prev, [moduleName]: false }));
    }
  };

  if (!candidate) return <DashboardLayout><div className="p-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <button onClick={() => navigate(`/candidates/${candidate.id}`)} className="flex items-center text-gray-500 mb-4 hover:text-gray-800 transition-all">
          <ArrowLeft className="mr-2"/> Back to Candidate Profile
        </button>
        
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Audit Hub: {candidate.name}</h1>
              <p className="text-gray-500 text-sm mt-1">Run specific verification modules on the candidate's submitted documents.</p>
            </div>
            <div className="text-sm font-bold bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl w-full md:w-auto text-center md:text-left">Candidate ID: #{candidate.id}</div>
        </div>

        {modules.map((group) => (
          <div key={group.title} className="space-y-4">
            <h2 className="font-bold text-gray-500 uppercase text-xs tracking-wider ml-1">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items.map((item) => {
                const status = moduleStatuses[item];
                const isVerifying = verifying[item];
                
                return (
                  <div key={item} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        status === "Verified" ? "bg-green-50 text-green-500" :
                        status === "Fraud" ? "bg-red-50 text-red-500" :
                        status === "Rejected" ? "bg-orange-50 text-orange-500" :
                        "bg-indigo-50 text-indigo-500"
                      }`}>
                        {status === "Fraud" ? <ShieldAlert className="w-5 h-5" /> : 
                         status === "Rejected" ? <XCircle className="w-5 h-5" /> : 
                         <ShieldCheck className="w-5 h-5" />}
                      </div>
                      <span className="font-semibold text-gray-800">{item}</span>
                    </div>
                    
                    {status ? (
                      <button disabled className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                        status === "Verified" ? "bg-green-50 text-green-600 border-green-100" :
                        status === "Fraud" ? "bg-red-50 text-red-600 border-red-100" :
                        "bg-orange-50 text-orange-600 border-orange-100"
                      }`}>
                        {status === "Verified" && <CheckCircle className="w-4 h-4" />}
                        {status === "Fraud" && <ShieldAlert className="w-4 h-4" />}
                        {status === "Rejected" && <XCircle className="w-4 h-4" />}
                        {status}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleVerify(item)}
                        disabled={isVerifying}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                          isVerifying ? "bg-gray-100 text-gray-500" : "bg-[#5B5FEF] text-white hover:bg-[#4B4FD8]"
                        }`}
                      >
                        {isVerifying ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                        ) : (
                          "Verify Now"
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
export default CandidateVerificationCenter;