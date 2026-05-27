import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { User, Shield, Bell, Moon, Sun, Smartphone, Key, Globe, Layout, CheckCircle, Save } from "lucide-react";

function Settings() {
  const [profile, setProfile] = useState({ name: "System Administrator", email: "admin@karves.com" });
  
  // Fake state toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("15 mins");

  // Load from system_users
  useEffect(() => {
    const saved = localStorage.getItem("system_users");
    if (saved) {
      const users = JSON.parse(saved);
      const admin = users.find((u: any) => u.id === "USR-1001");
      if (admin) {
        setProfile({ name: admin.name, email: admin.email });
      }
    }
  }, []);

  const handleSaveProfile = () => {
    const saved = localStorage.getItem("system_users");
    if (saved) {
      const users = JSON.parse(saved);
      const updatedUsers = users.map((u: any) => {
        if (u.id === "USR-1001") {
          return { ...u, name: profile.name, email: profile.email };
        }
        return u;
      });
      localStorage.setItem("system_users", JSON.stringify(updatedUsers));
      alert("Profile Settings Saved Successfully.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Settings & Configuration</h1>
          <p className="text-gray-500 mt-2">Manage platform preferences, security protocols, and system settings.</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Profile Settings */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
               <div className="p-2.5 bg-indigo-50 rounded-xl"><User className="w-6 h-6 text-[#5B5FEF]" /></div>
               <h2 className="text-2xl font-bold text-gray-900">Profile Configuration</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-[#5B5FEF] transition-all"
                />
              </div>

              <button 
                onClick={handleSaveProfile}
                className="bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-6 py-3.5 rounded-2xl shadow-md transition-all font-bold flex items-center justify-center gap-2 w-full mt-4"
              >
                <Save className="w-5 h-5" />
                Update Admin Identity
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
               <div className="p-2.5 bg-red-50 rounded-xl"><Shield className="w-6 h-6 text-red-500" /></div>
               <h2 className="text-2xl font-bold text-gray-900">Security Architecture</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Smartphone className="w-6 h-6 text-gray-400" />
                  <div>
                    <h3 className="text-gray-900 font-bold">Two-Factor Authentication (2FA)</h3>
                    <p className="text-gray-500 text-sm mt-0.5 font-medium">Protect platform access</p>
                  </div>
                </div>
                <button 
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`px-5 py-2 rounded-xl font-bold transition-all text-sm ${twoFactor ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
                >
                  {twoFactor ? "Enabled" : "Disabled"}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Key className="w-6 h-6 text-gray-400" />
                  <div>
                    <h3 className="text-gray-900 font-bold">Login Anomaly Alerts</h3>
                    <p className="text-gray-500 text-sm mt-0.5 font-medium">Identify suspicious location IPs</p>
                  </div>
                </div>
                <button 
                  onClick={() => setLoginAlerts(!loginAlerts)}
                  className={`px-5 py-2 rounded-xl font-bold transition-all text-sm ${loginAlerts ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
                >
                  {loginAlerts ? "Active" : "Paused"}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Globe className="w-6 h-6 text-gray-400" />
                  <div>
                    <h3 className="text-gray-900 font-bold">Session Expiry</h3>
                    <p className="text-gray-500 text-sm mt-0.5 font-medium">Idle timeout duration</p>
                  </div>
                </div>
                <select 
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-bold text-sm outline-none cursor-pointer appearance-none text-center"
                >
                  <option value="15 mins">15 mins</option>
                  <option value="30 mins">30 mins</option>
                  <option value="1 hour">1 hour</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* System Preferences */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
             <div className="p-2.5 bg-blue-50 rounded-xl"><Layout className="w-6 h-6 text-blue-500" /></div>
             <h2 className="text-2xl font-bold text-gray-900">Platform Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Theme */}
            <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Moon className="w-5 h-5 text-gray-400" /> UI Theme
                </h3>
                <p className="text-gray-500 mt-2 font-medium text-sm">Dashboard visual appearance.</p>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`mt-6 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {darkMode ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>}
                {darkMode ? "Dark Mode" : "Light Mode"}
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-400" /> Global Alerts
                </h3>
                <p className="text-gray-500 mt-2 font-medium text-sm">Master switch for system emails.</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`mt-6 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${notifications ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
              >
                {notifications ? "Broadcast Enabled" : "Muted"}
              </button>
            </div>

            {/* API Settings */}
            <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-400" /> External APIs
                </h3>
                <p className="text-gray-500 mt-2 font-medium text-sm">Data pipeline connections.</p>
              </div>
              <button className="mt-6 bg-blue-100 text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
                Active & Synced
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;