import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { Bell, Smartphone, Building2, Eye, EyeOff } from "lucide-react";

import {
  getCurrentUser,
  changePassword,
  updateProfile,
} from "../../api/authApi";

function Settings() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    username: "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);
  const [savingProfile, setSavingProfile] = useState(false);

  const handleProfileUpdate = async () => {
    try {
      setSavingProfile(true);

      const response = await updateProfile({
        username: profile.username,

        full_name: profile.full_name,

        email: profile.email,

        phone: profile.phone,
      });

      alert(response.message);

      await loadProfile();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Profile update failed");
    } finally {
      setSavingProfile(false);
    }
  };
  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");

      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");

      return;
    }

    try {
      setUpdatingPassword(true);

      const response = await changePassword(currentPassword, newPassword);

      alert(response.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Password update failed");
    } finally {
      setUpdatingPassword(false);
    }
  };
  const loadProfile = async () => {
    try {
      const data = await getCurrentUser();

      setProfile({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        username: data.username || "",
      });
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* PAGE HEADER */}

        <div className="mb-10">
          <h1 className="text-6xl font-extrabold tracking-tight text-slate-900">
            Settings
          </h1>

          <p className="text-slate-500 mt-3 text-base">
            Manage your account preferences and security configuration.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PROFILE CARD */}

          <div className="col-span-12 lg:col-span-4 xl:col-span-4">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              {/* COVER */}

              <div className="h-40 bg-gradient-to-r from-teal-50 to-slate-100 relative">
                <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
                  <div className="w-28 h-28 rounded-full bg-teal-100 border-[6px] border-white flex items-center justify-center shadow-lg">
                    <span className="text-6xl font-extrabold tracking-tight text-teal-700">
                      {profile.full_name?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-8 px-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {profile.full_name}
                  </h2>

                  <p className="text-slate-500 mt-2 text-base">
                    {profile.email}
                  </p>

                  <div className="inline-flex mt-5 px-5 py-2 rounded-full bg-teal-50 border border-teal-200 px-4 py-1">
                    <span className="text-teal-700 font-semibold">
                      SuperAdmin Access
                    </span>
                  </div>
                </div>

                <div className="border-t mt-8 pt-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <Bell className="w-6 h-6 text-slate-400" />

                    <span className="text-slate-600 text-lg truncate">
                      {profile.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Smartphone className="w-6 h-6 text-slate-400" />

                    <span className="text-slate-600 text-lg">
                      {profile.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Building2 className="w-6 h-6 text-slate-400" />

                    <span className="text-slate-600 text-lg">Super Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}

          <div className="col-span-12 lg:col-span-8 xl:col-span-8">
            <div>
              {/* TABS */}

              <div className="flex gap-8 border-b border-slate-200 mb-8">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`pb-5 text-lg font-medium ${
                    activeTab === "profile"
                      ? "text-teal-700 border-b-4 border-teal-600"
                      : "text-slate-500"
                  }`}
                >
                  Profile Details
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`pb-5 text-lg font-medium ${
                    activeTab === "security"
                      ? "text-teal-700 border-b-4 border-teal-600"
                      : "text-slate-500"
                  }`}
                >
                  Security
                </button>
              </div>

              {/* PROFILE TAB */}

              {activeTab === "profile" && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="p-8 border-b">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Personal Information
                    </h2>

                    <p className="text-slate-500 mt-2 text-lg">
                      Update your personal details visible to administration.
                    </p>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-3 font-medium text-slate-700">
                          Full Name
                        </label>

                        <input
                          type="text"
                          value={profile.full_name}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              full_name: e.target.value,
                            })
                          }
                          className="w-full border rounded-xl px-4 py-4"
                        />
                      </div>

                      <div>
                        <label className="block mb-3 font-medium text-slate-700">
                          Email Address
                        </label>

                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              email: e.target.value,
                            })
                          }
                          className="w-full border rounded-xl px-4 py-4"
                        />
                      </div>

                      <div>
                        <label className="block mb-3 font-medium text-slate-700">
                          Phone Number
                        </label>

                        <input
                          type="text"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              phone: e.target.value,
                            })
                          }
                          className="w-full border rounded-xl px-4 py-4"
                        />
                      </div>

                      <div>
                        <label className="block mb-3 font-medium text-slate-700">
                          Username
                        </label>

                        <input
                          type="text"
                          value={profile.username || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              username: e.target.value,
                            })
                          }
                          className="w-full border rounded-xl px-4 py-4"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        onClick={handleProfileUpdate}
                        disabled={savingProfile}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
                      >
                        {savingProfile ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="p-8 border-b">
                    <h2 className="text-3xl font-bold text-slate-900">
                      Change Password
                    </h2>

                    <p className="text-slate-500 mt-2">
                      Ensure your account is using a strong password.
                    </p>
                  </div>

                  <div className="p-8">
                    <div>
                      <label className="block mb-3 font-medium text-slate-700">
                        Current Password
                      </label>

                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full border rounded-xl px-4 py-4 pr-12"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-4 top-4"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="text-slate-400 w-5 h-5" />
                          ) : (
                            <Eye className="text-slate-400 w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                      <div>
                        <label className="block mb-3 font-medium text-slate-700">
                          New Password
                        </label>

                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full border rounded-xl px-4 py-4 pr-12"
                          />

                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-4"
                          >
                            {showNewPassword ? (
                              <EyeOff className="text-slate-400 w-5 h-5" />
                            ) : (
                              <Eye className="text-slate-400 w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-3 font-medium text-slate-700">
                          Confirm Password
                        </label>

                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full border rounded-xl px-4 py-4 pr-12"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-4"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="text-slate-400 w-5 h-5" />
                            ) : (
                              <Eye className="text-slate-400 w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-12">
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={updatingPassword}
                        className="px-8 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50"
                      >
                        {updatingPassword ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
