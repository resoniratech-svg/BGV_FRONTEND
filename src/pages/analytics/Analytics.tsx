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
import type { Candidate } from "../../types/Candidate";

function Analytics() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

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
  const ocrAccuracy = Math.max(0, 100 - (ocrFailures * 5)); // Just a dynamic mock calculation

  // Verification Trends (Dynamic Mock based on current numbers)
  const verificationData = [
    { month: "Jan", verified: 120, fraud: 20 },
    { month: "Feb", verified: 180, fraud: 25 },
    { month: "Mar", verified: 240, fraud: 30 },
    { month: "Apr", verified: 320, fraud: 18 },
    // Inject real data into the current month
    { month: "May (Current)", verified: verifiedCount, fraud: fraudCount },
  ];

  const processingData = [
    { name: "OCR", value: ocrAccuracy },
    { name: "Face Match", value: 94 },
    { name: "Fraud AI", value: 89 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-2">Verification insights and AI-powered analytics</p>
          </div>
          <button onClick={() => alert("Downloading CSV export...")} className="bg-[#5B5FEF] hover:bg-[#4B4FD8] transition-all text-white px-6 py-3 rounded-2xl shadow-lg font-medium">
            Export Analytics
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <p className="text-gray-500 font-medium text-sm">Total Processed Profiles</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-3">{totalCandidates}</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <p className="text-gray-500 font-medium text-sm">Fraud Detection Rate</p>
            <h2 className="text-4xl font-extrabold text-red-500 mt-3">{fraudRate}%</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <p className="text-gray-500 font-medium text-sm">OCR Accuracy Tracker</p>
            <h2 className="text-4xl font-extrabold text-green-500 mt-3">{ocrAccuracy}%</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <p className="text-gray-500 font-medium text-sm">Avg Processing Time</p>
            <h2 className="text-4xl font-extrabold text-blue-500 mt-3">1.2m</h2>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Trends */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Verification Trends</h2>
                <p className="text-gray-500 mt-1 text-sm">Monthly verification activity</p>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={verificationData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="verified" stroke="#5B5FEF" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="fraud" stroke="#EF4444" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Processing */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">AI Processing Accuracy</h2>
              <p className="text-gray-500 mt-1 text-sm">Verification engine performance benchmarks</p>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processingData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#5B5FEF" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Live Infrastructure Insights</h2>
            <button onClick={() => alert("Loading full infrastructure diagnostic report...")} className="text-[#5B5FEF] font-bold text-sm bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all">
              View Diagnostic Report
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
              <p className="text-red-700 font-bold text-sm">High Fraud Regions</p>
              <h3 className="text-4xl font-black text-red-600 mt-3">12</h3>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-6">
              <p className="text-yellow-700 font-bold text-sm">Live OCR Mismatches</p>
              <h3 className="text-4xl font-black text-yellow-600 mt-3">{ocrFailures}</h3>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
              <p className="text-emerald-700 font-bold text-sm">System Uptime</p>
              <h3 className="text-4xl font-black text-emerald-600 mt-3">99.9%</h3>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;