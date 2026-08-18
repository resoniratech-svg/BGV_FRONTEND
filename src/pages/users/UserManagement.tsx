import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useMemo, useEffect } from "react";
import {
  registerUser,
  getUsers,
  updateUser,
  deleteUserApi,
  toggleUserStatus,
} from "../../api/authApi";
import {
  Search,
  UserPlus,
  Users,
  ShieldBan,
  ShieldCheck,
  X,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

interface SystemUser {
  id: number;
  username: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  created_by?: number;
}

function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">(
    "ALL",
  );

  const [users, setUsers] = useState<SystemUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [editPassword, setEditPassword] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "SUPER_ADMIN",
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUser.username || !newUser.password) return;

    try {
      await registerUser({
        username: newUser.username,
        password: newUser.password,
        full_name: newUser.full_name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      });

      alert("User created successfully");
      await loadUsers();
      setShowAddModal(false);

      setNewUser({
        full_name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        role: "SUPER_ADMIN",
      });
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create user",
      );
    }
  };

  const deleteUser = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await deleteUserApi(id);
      await loadUsers();
      alert("User deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, {
        username: selectedUser.username,
        full_name: selectedUser.full_name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        role: selectedUser.role,
        password: editPassword || undefined,
      });

      await loadUsers();
      setEditPassword("");
      setShowEditModal(false);
      alert("User updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update user");
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      await toggleUserStatus(id);
      await loadUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = searchQuery.toLowerCase();

      const matchesSearch =
        user.username.toLowerCase().includes(search) ||
        (user.email || "").toLowerCase().includes(search) ||
        (user.phone || "").includes(search);

      const matchesFilter =
        userFilter === "ALL"
          ? true
          : userFilter === "ACTIVE"
            ? user.is_active
            : !user.is_active;

      return matchesSearch && matchesFilter;
    });
  }, [users, searchQuery, userFilter]);
  const displayedUsers = showAll ? filteredUsers : filteredUsers.slice(0, 10);
  const activeCount = users.filter((u) => u.is_active).length;
  const suspendedCount = users.filter((u) => !u.is_active).length;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      console.log("API USERS:", data);
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12 relative">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Access Management
            </h1>
            <p className="text-gray-500 mt-2">
              Control system roles, team permissions, and platform security.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <UserPlus className="w-5 h-5" />
            Add New Member
          </button>
        </div>

        {/* Stats Grid */}
        <div
          className="
sticky
top-4
z-20
grid
grid-cols-1
md:grid-cols-3
gap-6
"
        >
          {/* Total Members Card */}
          <div
            onClick={() => setUserFilter("ALL")}
            className={`bg-white rounded-3xl border shadow-sm p-6 flex flex-col justify-between cursor-pointer transition-all ${
              userFilter === "ALL"
                ? "border-[#5B5FEF] ring-2 ring-[#5B5FEF]/20"
                : "border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Total Members</p>
              <div className="p-2 bg-gray-50 rounded-xl">
                <Users className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-gray-900">
              {users.length}
            </h2>
          </div>

          {/* Active Seats Card */}
          <div
            onClick={() => setUserFilter("ACTIVE")}
            className={`bg-white rounded-3xl border shadow-sm p-6 flex flex-col justify-between cursor-pointer transition-all ${
              userFilter === "ACTIVE"
                ? "border-green-500 ring-2 ring-green-200"
                : "border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Active Seats</p>
              <div className="p-2 bg-green-50 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-green-500">
              {activeCount}
            </h2>
          </div>

          {/* Suspended Access Card */}
          <div
            onClick={() => setUserFilter("INACTIVE")}
            className={`bg-white rounded-3xl border shadow-sm p-6 flex flex-col justify-between cursor-pointer transition-all ${
              userFilter === "INACTIVE"
                ? "border-red-500 ring-2 ring-red-200"
                : "border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">
                Suspended Access
              </p>
              <div className="p-2 bg-red-50 rounded-xl">
                <ShieldBan className="w-4 h-4 text-red-500" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-red-500">
              {suspendedCount}
            </h2>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div
            className="
sticky
top-4
z-30
bg-white
p-6
border-b
border-gray-100
flex
items-center
justify-between
flex-wrap
gap-4
"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Platform Users
            </h2>
            <div className="relative w-full sm:w-auto">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search username, email or mobile number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F5F7FB] border border-gray-200 rounded-2xl pl-11 pr-5 py-3.5 outline-none w-full sm:w-[320px] focus:bg-white focus:border-[#5B5FEF] transition-all text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="overflow-auto max-h-[650px]">
            <table className="w-full min-w-[800px]">
              <thead className="sticky top-0 z-20 bg-[#F8FAFC]">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                    Username
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                    Assigned Role
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center p-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  displayedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                            {user.username.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-semibold text-gray-700 text-sm bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-6 text-sm text-gray-500 font-medium">
                        {user.phone || "-"}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block ${
                            user.is_active
                              ? "bg-green-50 text-green-700 border-green-100"
                              : "bg-red-50 text-red-700 border-red-100"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleStatus(user.id)}
                            className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                          >
                            {user.is_active ? "Suspend" : "Activate"}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowViewModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 transition-all rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-16 text-center text-gray-400 font-medium text-sm"
                    >
                      No team members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredUsers.length > 10 && (
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="
flex
items-center
gap-1
text-sm
font-semibold
text-indigo-600
hover:text-indigo-800
transition-colors
"
                >
                  {showAll ? "Show Less" : `View All (${filteredUsers.length})`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                Invite Team Member
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, full_name: e.target.value })
                  }
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone
                </label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  required
                  type="text"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl pl-4 pr-11 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Access Role
                </label>
                <input
                  type="text"
                  value="SUPER_ADMIN"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-2xl">
                  {selectedUser.username.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedUser.username}
                  </h3>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    User ID
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedUser.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    Access Role
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedUser.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    Full Name
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedUser.full_name || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    Email
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedUser.email || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    Phone
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedUser.phone || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    Last Login
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedUser.last_login
                      ? selectedUser.last_login.replace("T", " ")
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    Account Status
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedUser.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    Created Date
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowViewModal(false)}
                className="w-full px-4 py-3 mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Team Member
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  required
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={selectedUser.full_name || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser.email || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone
                </label>
                <input
                  type="text"
                  value={selectedUser.phone || ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Access Role
                </label>
                <input
                  type="text"
                  value="SUPER_ADMIN"
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl pl-4 pr-12 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                    placeholder="Leave empty if no change"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default UserManagement;
