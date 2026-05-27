import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect, useMemo } from "react";
import { Search, UserPlus, Users, Activity, ShieldBan, ShieldCheck, Mail, X, Eye, EyeOff, Edit2, Trash2 } from "lucide-react";

interface SystemUser {
  id: string;
  name: string;
  role: "Super Admin" | "Admin" | "Verification Officer" | "Fraud Analyst";
  email: string;
  status: "Active" | "Suspended" | "Pending Invite";
  lastActive: string;
  mobile?: string;
  password?: string;
}

const defaultUsers: SystemUser[] = [
  {
    id: "USR-1001",
    name: "System Administrator",
    role: "Super Admin",
    email: "admin@karves.com",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "USR-1002",
    name: "AI Verification Engine",
    role: "Verification Officer",
    email: "ai.engine@karves.com",
    status: "Active",
    lastActive: "System Process",
  }
];

function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", mobile: "", password: "", role: "Verification Officer" });

  useEffect(() => {
    const saved = localStorage.getItem("system_users");
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      localStorage.setItem("system_users", JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const user: SystemUser = {
      id: `USR-${1000 + users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      status: "Pending Invite",
      lastActive: "Never",
      mobile: newUser.mobile,
      password: newUser.password,
    };

    const updatedList = [...users, user];
    setUsers(updatedList);
    localStorage.setItem("system_users", JSON.stringify(updatedList));
    setShowAddModal(false);
    setNewUser({ name: "", email: "", mobile: "", password: "", role: "Verification Officer" });
  };

  const deleteUser = (id: string) => {
    if (id === "USR-1001") return;
    if (confirm("Are you sure you want to remove this team member?")) {
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      localStorage.setItem("system_users", JSON.stringify(updated));
    }
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    const updated = users.map((u) => 
      u.id === selectedUser.id ? selectedUser : u
    );
    setUsers(updated);
    localStorage.setItem("system_users", JSON.stringify(updated));
    setShowEditModal(false);
  };

  const toggleStatus = (id: string) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        if (u.status === "Active") return { ...u, status: "Suspended" as const };
        if (u.status === "Suspended") return { ...u, status: "Active" as const };
        if (u.status === "Pending Invite") return { ...u, status: "Active" as const };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("system_users", JSON.stringify(updated));
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [users, searchQuery]);

  const activeCount = users.filter((u) => u.status === "Active").length;
  const suspendedCount = users.filter((u) => u.status === "Suspended").length;
  const pendingCount = users.filter((u) => u.status === "Pending Invite").length;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12 relative">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Access Management</h1>
            <p className="text-gray-500 mt-2">Control system roles, team permissions, and platform security.</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <UserPlus className="w-5 h-5" />
            Invite New Member
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Total Members</p>
              <div className="p-2 bg-gray-50 rounded-xl"><Users className="w-4 h-4 text-gray-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-gray-900">{users.length}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Active Seats</p>
              <div className="p-2 bg-green-50 rounded-xl"><ShieldCheck className="w-4 h-4 text-green-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-green-500">{activeCount}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Suspended Access</p>
              <div className="p-2 bg-red-50 rounded-xl"><ShieldBan className="w-4 h-4 text-red-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-red-500">{suspendedCount}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Pending Invites</p>
              <div className="p-2 bg-yellow-50 rounded-xl"><Mail className="w-4 h-4 text-yellow-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-yellow-500">{pendingCount}</h2>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Platform Users</h2>
            <div className="relative w-full sm:w-auto">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search name, role, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F5F7FB] border border-gray-200 rounded-2xl pl-11 pr-5 py-3.5 outline-none w-full sm:w-[320px] focus:bg-white focus:border-[#5B5FEF] transition-all text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">User Profile</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">Assigned Role</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">Last Active</th>
                  <th className="text-left p-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-center p-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                             {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-semibold text-gray-700 text-sm bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-6 text-sm text-gray-500 font-medium">
                         {user.lastActive}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block ${
                            user.status === "Active"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : user.status === "Suspended"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : "bg-yellow-50 text-yellow-700 border-yellow-100"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-2">
                           <button 
                             onClick={() => toggleStatus(user.id)}
                             className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                           >
                             {user.status === "Active" ? "Suspend" : "Approve"}
                           </button>

                           <button 
                             onClick={() => { setSelectedUser(user); setShowViewModal(true); }}
                             className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                             title="View Details"
                           >
                             <Eye className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => { setSelectedUser(user); setShowEditModal(true); }}
                             className="p-2 transition-all rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                             title="Edit User"
                           >
                             <Edit2 className="w-4 h-4" />
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
                    <td colSpan={5} className="p-16 text-center text-gray-400 font-medium text-sm">
                      No team members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Invite Team Member</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                  placeholder="jane@karves.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                <input 
                  required
                  type="tel" 
                  value={newUser.mobile}
                  onChange={(e) => setNewUser({...newUser, mobile: e.target.value})}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    required
                    type={showPassword ? "text" : "password"} 
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl pl-4 pr-11 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Access Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm appearance-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="Verification Officer">Verification Officer</option>
                  <option value="Fraud Analyst">Fraud Analyst</option>
                </select>
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
                   Send Invite
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
                   {selectedUser.name.charAt(0)}
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                   <p className="text-gray-500">{selectedUser.email}</p>
                 </div>
               </div>
               
               <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                 <div className="flex justify-between">
                   <span className="text-sm font-semibold text-gray-500">User ID</span>
                   <span className="text-sm font-bold text-gray-900">{selectedUser.id}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm font-semibold text-gray-500">Access Role</span>
                   <span className="text-sm font-bold text-gray-900">{selectedUser.role}</span>
                 </div>
                 {selectedUser.mobile && (
                   <div className="flex justify-between">
                     <span className="text-sm font-semibold text-gray-500">Mobile Number</span>
                     <span className="text-sm font-bold text-gray-900">{selectedUser.mobile}</span>
                   </div>
                 )}
                 {selectedUser.password && (
                   <div className="flex justify-between items-center">
                     <span className="text-sm font-semibold text-gray-500">Password</span>
                     <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-gray-900">
                         {showPassword ? selectedUser.password : "••••••••"}
                       </span>
                       <button 
                         onClick={() => setShowPassword(!showPassword)}
                         className="text-gray-400 hover:text-gray-600 transition-all p-1"
                         title={showPassword ? "Hide Password" : "Show Password"}
                       >
                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                     </div>
                   </div>
                 )}
                 <div className="flex justify-between">
                   <span className="text-sm font-semibold text-gray-500">Account Status</span>
                   <span className="text-sm font-bold text-gray-900">{selectedUser.status}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm font-semibold text-gray-500">Last Active</span>
                   <span className="text-sm font-bold text-gray-900">{selectedUser.lastActive}</span>
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
              <h2 className="text-xl font-bold text-gray-900">Edit Team Member</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleEditUser} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                <input 
                  required
                  type="tel" 
                  value={selectedUser.mobile || ""}
                  onChange={(e) => setSelectedUser({...selectedUser, mobile: e.target.value})}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    required
                    type={showPassword ? "text" : "password"} 
                    value={selectedUser.password || ""}
                    onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})}
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl pl-4 pr-11 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm"
                    placeholder="Update secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-all"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Access Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value as any})}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all text-sm appearance-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="Verification Officer">Verification Officer</option>
                  <option value="Fraud Analyst">Fraud Analyst</option>
                </select>
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