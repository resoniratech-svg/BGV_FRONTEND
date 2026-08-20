import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../api/dashboardApi";
import { Users } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    total_candidates: 0,
    verified: 0,
    pending: 0,
    high_risk: 0,
    medium_risk: 0,
    low_risk: 0,
    completed_today: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error("Dashboard Load Failed", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-gray-900 text-4xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Real-time background verification analytics
            </p>
          </div>

          <button
            onClick={() => navigate("/candidates/new")}
            className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-all"
          >
            + Add Candidate
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-7">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search candidates by name, email or phone..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#5B5FEF]"
            />

            <button
              onClick={() => navigate("/candidates")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              View Candidates
            </button>
          </div>
        </div>

        {/* KPI Cards / Verification Status Queue Row */}
        <div className="mb-7">
          <div className="grid grid-cols-4 gap-5">
            {/* Total Candidates */}
            <div
              onClick={() => navigate("/candidates")}
              className="
    bg-white
    p-5
    rounded-2xl
    shadow-sm
    border
    border-gray-100
    cursor-pointer
    hover:border-yellow-300
    hover:shadow-md
    transition-all
  "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">Total candidates</p>
                  <h2 className="text-yellow-500 text-4xl font-bold mt-4">
                    {summary.total_candidates}
                  </h2>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center">
                  <span className="text-yellow-500 text-xl">⏳</span>
                </div>
              </div>
            </div>

            {/* In Review */}
            <div
              onClick={() => navigate("/verification/queue")}
              className="
    bg-white
    p-5
    rounded-2xl
    shadow-sm
    border
    border-gray-100
    cursor-pointer
    hover:border-blue-300
    hover:shadow-md
    transition-all
  "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">
                    Under Verification
                  </p>
                  <h2 className="text-blue-500 text-4xl font-bold mt-4">
                    {summary.pending}
                  </h2>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-500 text-xl">👥</span>
                </div>
              </div>
            </div>

            {/* Completed Today */}
            <div
              onClick={() =>
                navigate("/candidates", {
                  state: {
                    filterType: "COMPLETED_TODAY",
                    date: new Date().toISOString().split("T")[0],
                  },
                })
              }
              className="
    bg-white
    p-5
    rounded-2xl
    shadow-sm
    border
    border-gray-100
    cursor-pointer
    hover:border-green-300
    hover:shadow-md
    transition-all
  "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">Completed Today</p>
                  <h2 className="text-green-500 text-4xl font-bold mt-4">
                    {summary.completed_today}
                  </h2>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                  <span className="text-green-500 text-xl">✔</span>
                </div>
              </div>
            </div>

            {/* Fraud Alerts */}
            {/* Fraud Alerts */}
            <div
              onClick={() => navigate("/fraud-center")}
              className="
    bg-white
    p-5
    rounded-2xl
    shadow-sm
    border
    border-gray-100
    cursor-pointer
    hover:border-red-300
    hover:shadow-md
    transition-all
  "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium">Fraud Alerts</p>
                  <h2 className="text-red-500 text-4xl font-bold mt-4">
                    {summary.high_risk}
                  </h2>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                  <span className="text-red-500 text-xl">⚠</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Split Layout Structure */}
        <div className="grid grid-cols-12 gap-6 mb-7">
          {/* Risk Overview */}
          <div className="col-span-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
              <h2 className="text-gray-900 text-2xl font-semibold mb-8">
                Risk Overview
              </h2>

              <div className="space-y-5">
                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">
                  <p className="text-red-500 text-lg font-semibold">
                    High Risk
                  </p>
                  <p className="text-gray-900 text-4xl font-bold mt-3">
                    {summary.high_risk}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-100 p-5 rounded-2xl">
                  <p className="text-yellow-500 text-lg font-semibold">
                    Medium Risk
                  </p>
                  <p className="text-gray-900 text-4xl font-bold mt-3">
                    {summary.medium_risk}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-100 p-5 rounded-2xl">
                  <p className="text-green-500 text-lg font-semibold">
                    Low Risk
                  </p>
                  <p className="text-gray-900 text-4xl font-bold mt-3">
                    {summary.low_risk}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full">
              <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
              <p className="text-gray-500 mb-5">Common verification tasks</p>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/candidates/new")}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200 group"
                >
                  <div className="text-left">
                    <p className="font-semibold text-indigo-700">
                      Add Candidate
                    </p>
                    <p className="text-xs text-indigo-500 mt-1">
                      Register a new candidate
                    </p>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-all">
                    👤
                  </span>
                </button>

                <button
                  onClick={() => navigate("/verification")}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="text-left">
                    <p className="font-semibold text-blue-700">
                      Verification Queue
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      Process pending verifications
                    </p>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-all">
                    🛡️
                  </span>
                </button>

                <button
                  onClick={() => navigate("/reports")}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200 group"
                >
                  <div className="text-left">
                    <p className="font-semibold text-emerald-700">
                      Generate Report
                    </p>
                    <p className="text-xs text-emerald-500 mt-1">
                      Download verification reports
                    </p>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-all">
                    📄
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activities Full Width */}
          <div className="col-span-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-gray-900 text-2xl font-semibold">
                  Recent Verification Activities
                </h2>
                <button
                  onClick={() => navigate("/audit-logs")}
                  className="text-[#5B5FEF] font-medium hover:text-[#4B4FD8] transition-all"
                >
                  View All
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div>
                    <p className="text-gray-900 font-medium">
                      Identity records processed successfully
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Rahul Sharma</p>
                  </div>
                  <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
                    Completed
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div>
                    <p className="text-gray-900 font-medium">
                      Fraud mismatch detected
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Priya Reddy</p>
                  </div>
                  <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium">
                    Alert
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 font-medium">
                      Financial registry evaluation processing
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Arun Kumar</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
