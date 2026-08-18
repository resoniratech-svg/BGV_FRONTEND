import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { BarChart3, TrendingUp, ShieldAlert, Cpu, CheckCircle } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

type AnalyticsMetricType = "ALL" | "FRAUD" | "OCR" | "SPEED";

function Analytics() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  
  // 1. Added active state filter for interacting with KPI metrics
  const [activeMetric, setActiveMetric] = useState<AnalyticsMetricType>("ALL");

  useEffect(() => {
    const saved = localStorage.getItem("candidates");
    if (saved) setCandidates(JSON.parse(saved));
  }, []);

  const totalCandidates = candidates.length || 1; // Prevent division by zero
  const verifiedCount = candidates.filter(c => c.status === "Verified").length;
  const fraudCount = candidates.filter(c => c.status === "Fraud Alert" || c.status === "Flagged / Rejected").length;
  const fraudRate = ((fraudCount / totalCandidates) * 100).toFixed(1);
  
  // OCR Failures vs Success
  const ocrFailures = candidates.filter(c => c.moduleStatuses?.["OCR Verification"] === "Fraud" || c.moduleStatuses?.["OCR Verification"] === "Rejected").length;
  const ocrAccuracy = Math.max(0, 100 - (ocrFailures * 5)); // Dynamic calculations based on datasets

  // Verification Trends (Dynamic dataset injections)
  const verificationData = [
    { month: "Jan", verified: 120, fraud: 20 },
    { month: "Feb", verified: 180, fraud: 25 },
    { month: "Mar", verified: 240, fraud: 30 },
    { month: "Apr", verified: 320, fraud: 18 },
    { month: "May (Current)", verified: verifiedCount, fraud: fraudCount },
  ];

  const processingData = [
    { name: "OCR Engine", value: ocrAccuracy },
    { name: "Face Match", value: 94 },
    { name: "Fraud AI Matrix", value: 89 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        
        {/* Header Block Row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Analytics Panel</h1>
            <p className="text-gray-500 mt-2">Verification performance indices, processing metrics, and compliance analytics.</p>
          </div>
          <button 
            onClick={() => alert("Downloading analytical payload compilation (CSV)...")} 
            className="bg-[#5B5FEF] hover:bg-[#4B4FD8] transition-all text-white px-6 py-3 rounded-2xl shadow-md font-bold flex items-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            Export Infrastructure Logs
          </button>
        </div>

        {/* 2. Interactive Analytical KPI Tracking Dashboard Grid Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* Box 1: Total Processed Profiles */}
          <div 
            onClick={() => setActiveMetric("ALL")}
            className={`bg-white p-6 rounded-3xl border cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 flex flex-col justify-between ${
              activeMetric === "ALL" 
                ? "border-gray-400 ring-2 ring-gray-400/10 bg-gray-50/30" 
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Total Processed Profiles</p>
              <div className={`p-2 rounded-xl transition-colors ${activeMetric === "ALL" ? "bg-gray-200 text-gray-700" : "bg-gray-50 text-gray-400"}`}>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-gray-900 mt-3">{totalCandidates}</h2>
          </div>

          {/* Box 2: Fraud Detection Rate */}
          <div 
            onClick={() => setActiveMetric("FRAUD")}
            className={`bg-white p-6 rounded-3xl border cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 flex flex-col justify-between ${
              activeMetric === "FRAUD" 
                ? "border-red-500 ring-2 ring-red-500/10 bg-red-50/20" 
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Fraud Detection Rate</p>
              <div className={`p-2 rounded-xl transition-colors ${activeMetric === "FRAUD" ? "bg-red-500 text-white" : "bg-red-50 text-red-500"}`}>
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-red-500 mt-3">{fraudRate}%</h2>
          </div>

          {/* Box 3: OCR Accuracy Tracker */}
          <div 
            onClick={() => setActiveMetric("OCR")}
            className={`bg-white p-6 rounded-3xl border cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 flex flex-col justify-between ${
              activeMetric === "OCR" 
                ? "border-green-500 ring-2 ring-green-500/10 bg-green-50/20" 
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">OCR Accuracy Tracker</p>
              <div className={`p-2 rounded-xl transition-colors ${activeMetric === "OCR" ? "bg-green-500 text-white" : "bg-green-50 text-green-500"}`}>
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-green-500 mt-3">{ocrAccuracy}%</h2>
          </div>

          {/* Box 4: Avg Processing Time */}
          <div 
            onClick={() => setActiveMetric("SPEED")}
            className={`bg-white p-6 rounded-3xl border cursor-pointer select-none transition-all duration-200 transform hover:-translate-y-0.5 flex flex-col justify-between ${
              activeMetric === "SPEED" 
                ? "border-blue-500 ring-2 ring-blue-500/10 bg-blue-50/20" 
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Avg Processing Speed</p>
              <div className={`p-2 rounded-xl transition-colors ${activeMetric === "SPEED" ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500"}`}>
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-blue-500 mt-3">1.2m</h2>
          </div>
        </div>

        {/* Dynamic Graphic Analytics Charts Visualization Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Trend Stream Analysis Terminal Panel */}
          <div className={`bg-white rounded-3xl border shadow-sm p-8 transition-all duration-300 ${
            activeMetric === "FRAUD" ? "ring-2 ring-red-500/10 border-red-200" : "border-gray-100"
          }`}>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Verification Activity Trends {activeMetric === "FRAUD" && <span className="text-sm font-semibold text-red-500">(Fraud Focus Mode)</span>}
                </h2>
                <p className="text-gray-500 mt-1 text-sm">Monthly verification throughput metrics</p>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={verificationData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line 
                    type="monotone" 
                    dataKey="verified" 
                    stroke="#5B5FEF" 
                    strokeWidth={activeMetric === "FRAUD" ? 2 : 4} 
                    opacity={activeMetric === "FRAUD" ? 0.3 : 1}
                    dot={{ r: 4, strokeWidth: 2 }} 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fraud" 
                    stroke="#EF4444" 
                    strokeWidth={activeMetric === "FRAUD" ? 5 : 4} 
                    dot={{ r: activeMetric === "FRAUD" ? 6 : 4, strokeWidth: 2 }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Processing Benchmark Analytics Panel */}
          <div className={`bg-white rounded-3xl border shadow-sm p-8 transition-all duration-300 ${
            activeMetric === "OCR" ? "ring-2 ring-green-500/10 border-green-200" : "border-gray-100"
          }`}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                AI Processing Accuracy {activeMetric === "OCR" && <span className="text-sm font-semibold text-green-500">(OCR Precision Focus)</span>}
              </h2>
              <p className="text-gray-500 mt-1 text-sm">Verification engine infrastructure performance benchmarks</p>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processingData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar 
                    dataKey="value" 
                    fill={activeMetric === "OCR" ? "#10B981" : "#5B5FEF"} 
                    radius={[8, 8, 8, 8]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Global Live Infrastructure Diagnostics Block Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Live Infrastructure Insights</h2>
            <button 
              onClick={() => alert("Loading systematic structural diagnostic trace payload...")} 
              className="text-[#5B5FEF] font-bold text-sm bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all"
            >
              View Diagnostic Report
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
              <p className="text-red-700 font-bold text-sm">High Risk Regions</p>
              <h3 className="text-4xl font-black text-red-600 mt-3">12</h3>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-6">
              <p className="text-yellow-700 font-bold text-sm">Live OCR Document Failures</p>
              <h3 className="text-4xl font-black text-yellow-600 mt-3">{ocrFailures}</h3>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
              <p className="text-emerald-700 font-bold text-sm">System Cluster Uptime</p>
              <h3 className="text-4xl font-black text-emerald-600 mt-3">99.9%</h3>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Analytics;