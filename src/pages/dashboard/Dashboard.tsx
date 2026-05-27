import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* Header */}
        <div>

          <h1 className="text-gray-900 text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Real-time background verification analytics
          </p>

        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">

          {/* Total Candidates */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 font-medium">
                  Total Candidates
                </p>

                <h2 className="text-gray-900 text-5xl font-bold mt-4">
                  1,240
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">

                <span className="text-[#5B5FEF] text-xl">
                  👥
                </span>

              </div>

            </div>

          </div>

          {/* Verified */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 font-medium">
                  Verified
                </p>

                <h2 className="text-green-500 text-5xl font-bold mt-4">
                  980
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">

                <span className="text-green-500 text-xl">
                  ✔
                </span>

              </div>

            </div>

          </div>

          {/* Pending */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 font-medium">
                  Pending
                </p>

                <h2 className="text-yellow-500 text-5xl font-bold mt-4">
                  180
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

                <span className="text-yellow-500 text-xl">
                  ⏳
                </span>

              </div>

            </div>

          </div>

          {/* Fraud Alerts */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 font-medium">
                  Fraud Alerts
                </p>

                <h2 className="text-red-500 text-5xl font-bold mt-4">
                  80
                </h2>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">

                <span className="text-red-500 text-xl">
                  ⚠
                </span>

              </div>

            </div>

          </div>

        </div>
        {/* Verification Queue Summary */}
<div className="grid grid-cols-3 gap-6">

  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

    <p className="text-gray-500 font-medium">
      Waiting For Verification
    </p>

    <h2 className="text-yellow-500 text-5xl font-bold mt-4">
      42
    </h2>

  </div>

  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

    <p className="text-gray-500 font-medium">
      In Review
    </p>

    <h2 className="text-blue-500 text-5xl font-bold mt-4">
      18
    </h2>

  </div>

  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

    <p className="text-gray-500 font-medium">
      Completed Today
    </p>

    <h2 className="text-green-500 text-5xl font-bold mt-4">
      26
    </h2>

  </div>

</div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-3 gap-6">

          {/* Verification Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 col-span-2">

            <div className="flex items-center justify-between mb-8">

              <h2 className="text-gray-900 text-2xl font-semibold">
                Verification Progress
              </h2>

              <button 
                onClick={() => navigate('/reports')}
                className="bg-[#5B5FEF] text-white px-5 py-2 rounded-xl text-sm hover:bg-[#4B4FD8] transition-all"
              >
                View Report
              </button>

            </div>

            <div className="space-y-8">

              {/* Aadhaar */}
              <div>

                <div className="flex justify-between mb-3">

                  <span className="text-gray-700 font-medium">
                    Aadhaar Verification
                  </span>

                  <span className="text-green-500 font-semibold">
                    92%
                  </span>

                </div>

                <div className="w-full bg-gray-100 h-3 rounded-full">

                  <div className="bg-green-500 h-3 rounded-full w-[92%]" />

                </div>

              </div>

              {/* PAN */}
              <div>

                <div className="flex justify-between mb-3">

                  <span className="text-gray-700 font-medium">
                    PAN Verification
                  </span>

                  <span className="text-[#5B5FEF] font-semibold">
                    85%
                  </span>

                </div>

                <div className="w-full bg-gray-100 h-3 rounded-full">

                  <div className="bg-[#5B5FEF] h-3 rounded-full w-[85%]" />

                </div>

              </div>

              {/* Face Match */}
              <div>

                <div className="flex justify-between mb-3">

                  <span className="text-gray-700 font-medium">
                    Face Match
                  </span>

                  <span className="text-yellow-500 font-semibold">
                    70%
                  </span>

                </div>

                <div className="w-full bg-gray-100 h-3 rounded-full">

                  <div className="bg-yellow-500 h-3 rounded-full w-[70%]" />

                </div>

              </div>

              {/* Fraud Analysis */}
              <div>

                <div className="flex justify-between mb-3">

                  <span className="text-gray-700 font-medium">
                    Fraud Analysis
                  </span>

                  <span className="text-red-500 font-semibold">
                    55%
                  </span>

                </div>

                <div className="w-full bg-gray-100 h-3 rounded-full">

                  <div className="bg-red-500 h-3 rounded-full w-[55%]" />

                </div>

              </div>

            </div>

          </div>

          {/* Risk Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-gray-900 text-2xl font-semibold mb-8">
              Risk Overview
            </h2>

            <div className="space-y-5">

              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">

                <p className="text-red-500 text-lg font-semibold">
                  High Risk
                </p>

                <p className="text-gray-900 text-4xl font-bold mt-3">
                  18
                </p>

              </div>

              <div className="bg-yellow-50 border border-yellow-100 p-5 rounded-2xl">

                <p className="text-yellow-500 text-lg font-semibold">
                  Medium Risk
                </p>

                <p className="text-gray-900 text-4xl font-bold mt-3">
                  42
                </p>

              </div>

              <div className="bg-green-50 border border-green-100 p-5 rounded-2xl">

                <p className="text-green-500 text-lg font-semibold">
                  Low Risk
                </p>

                <p className="text-gray-900 text-4xl font-bold mt-3">
                  180
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between mb-8">

            <h2 className="text-gray-900 text-2xl font-semibold">
              Recent Verification Activities
            </h2>

            <button 
              onClick={() => navigate('/audit-logs')}
              className="text-[#5B5FEF] font-medium hover:text-[#4B4FD8] transition-all"
            >
              View All
            </button>

          </div>

          <div className="space-y-6">

            {/* Activity */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">

              <div>

                <p className="text-gray-900 font-medium">
                  Aadhaar verified successfully
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Rahul Sharma
                </p>

              </div>

              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
                Completed
              </span>

            </div>

            {/* Activity */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">

              <div>

                <p className="text-gray-900 font-medium">
                  Fraud mismatch detected
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Priya Reddy
                </p>

              </div>

              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium">
                Alert
              </span>

            </div>

            {/* Activity */}
            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-900 font-medium">
                  PAN verification processing
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Arun Kumar
                </p>

              </div>

              <span className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium">
                Pending
              </span>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;