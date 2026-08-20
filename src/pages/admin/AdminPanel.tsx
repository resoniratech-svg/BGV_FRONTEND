import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";
import { Link } from "react-router-dom";
const admins = [
  {
    id: "ADM-1001",
    name: "Anjali Sharma",
    role: "Super Admin",
    access: "Full Access",
    status: "Active",
  },
  {
    id: "ADM-1002",
    name: "Rahul Verma",
    role: "Operations Admin",
    access: "Verification Access",
    status: "Active",
  },
  {
    id: "ADM-1003",
    name: "Priya Reddy",
    role: "Fraud Analyst",
    access: "Fraud Monitoring",
    status: "Restricted",
  },
];

function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAdmins = admins.filter((admin) => {
    return (
      admin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.access.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 mt-2">Manage platform administrators and enterprise controls</p>
          </div>

          <Link to="/admin/add-admin" className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-6 py-3 rounded-2xl shadow-lg transition-all">
            + Add Admin
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-500">Total Admins</p>
            <h2 className="text-5xl font-bold text-gray-900 mt-4">24</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-500">Active Sessions</p>
            <h2 className="text-5xl font-bold text-green-500 mt-4">18</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-500">Restricted Users</p>
            <h2 className="text-5xl font-bold text-red-500 mt-4">2</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-500">System Roles</p>
            <h2 className="text-5xl font-bold text-blue-500 mt-4">8</h2>
          </div>
        </div>

        {/* System Controls */}
        <div className="grid grid-cols-3 gap-6">
          {/* Verification Engine */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900">Verification Engine</h2>
            <p className="text-gray-500 mt-2">OCR and AI verification systems</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                Operational
              </span>
              <button className="text-[#5B5FEF] font-medium hover:text-[#4B4FD8] transition-all">
                Configure
              </button>
            </div>
          </div>

          {/* Fraud AI */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900">Fraud Detection AI</h2>
            <p className="text-gray-500 mt-2">Real-time fraud monitoring engine</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                Active
              </span>
              <button className="text-[#5B5FEF] font-medium hover:text-[#4B4FD8] transition-all">
                Configure
              </button>
            </div>
          </div>

          {/* DigiLocker APIs */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900">DigiLocker APIs</h2>
            <p className="text-gray-500 mt-2">Government verification integrations</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                Connected
              </span>
              <button className="text-[#5B5FEF] font-medium hover:text-[#4B4FD8] transition-all">
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Admin Users Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Top */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Platform Administrators</h2>
            <input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-3 outline-none w-[320px] focus:border-[#5B5FEF] transition-all"
            />
          </div>

          {/* Table */}
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="text-left p-6 text-gray-500">Admin ID</th>
                <th className="text-left p-6 text-gray-500">Name</th>
                <th className="text-left p-6 text-gray-500">Role</th>
                <th className="text-left p-6 text-gray-500">Access Level</th>
                <th className="text-left p-6 text-gray-500">Status</th>
                <th className="text-left p-6 text-gray-500">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <td className="p-6 font-semibold text-gray-900">{admin.id}</td>
                    <td className="p-6 text-gray-700">{admin.name}</td>
                    <td className="p-6 text-gray-600">{admin.role}</td>
                    <td className="p-6 text-gray-600">{admin.access}</td>
                    <td className="p-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          admin.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <button className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-5 py-2 rounded-xl transition-all">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 font-medium">
                    No administrators found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminPanel;