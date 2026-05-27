import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { 
  ShieldCheck, CreditCard, FileText, UserCheck, ScanSearch, 
  Brain, GraduationCap, Briefcase, Wallet, Scale, Globe 
} from "lucide-react";
import type { Candidate } from "../../types/Candidate";

const verificationGroups = [
  {
    title: "Identity Verification",
    items: [
      { name: "Aadhaar Verification", icon: ShieldCheck, path: "/verification/aadhaar" },
      { name: "PAN Verification", icon: CreditCard, path: "/verification/pan" },
      { name: "Passport Verification", icon: FileText, path: "/verification/passport" },
      { name: "Driving License Verification", icon: FileText, path: "/verification/dl" },
      { name: "Face Match", icon: UserCheck, path: "/verification/face-match" },
    ],
  },
  {
    title: "AI Verification",
    items: [
      { name: "OCR Verification", icon: ScanSearch, path: "/verification/ocr" },
      { name: "Deepfake Detection", icon: Brain, path: "/verification/deepfake" },
      { name: "Resume Parsing", icon: FileText, path: "/verification/resume-parsing" },
    ],
  },
  {
    title: "Background Checks",
    items: [
      { name: "Education Verification", icon: GraduationCap, path: "/verification/education" },
      { name: "Employment Verification", icon: Briefcase, path: "/verification/employment" },
      { name: "Salary Slip Verification", icon: Wallet, path: "/verification/salary-slip" },
      { name: "Credit Bureau Check", icon: CreditCard, path: "/verification/credit-bureau" },
      { name: "Court Record Verification", icon: Scale, path: "/verification/court-record" },
      { name: "Global Watchlist Screening", icon: Globe, path: "/verification/watchlist" },
    ],
  },
];

function VerificationCenter() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("candidates");
    if (saved) setCandidates(JSON.parse(saved));
  }, []);

  const underVerificationCount = candidates.filter(c => c.status === "Under Verification").length;

  return (
    <DashboardLayout>
      <div className="space-y-10 max-w-7xl mx-auto pb-12">
        
        {/* Header & Operational Snapshot */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Verification Center</h1>
            <p className="text-slate-500 mt-2">Manage identity, AI, and background verification modules.</p>
          </div>
          <div className="bg-white border border-indigo-100 p-4 rounded-3xl shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Verifications</p>
            <p className="text-3xl font-black text-indigo-600">{underVerificationCount}</p>
          </div>
        </div>

        {/* Verification Groups */}
        {verificationGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-2xl font-bold text-slate-800 mb-5">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-[#5B5FEF] hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-[#5B5FEF] transition-colors">
                        <Icon size={22} className="text-[#5B5FEF] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{item.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">Open verification module</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default VerificationCenter;