import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, forgotPassword } from "../../api/authApi";
import { Eye, EyeOff } from "lucide-react";
function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [sendingResetEmail, setSendingResetEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    try {
      const response = await loginUser(username, password);
      console.log(response);

      localStorage.setItem("token", response.access_token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      alert("Enter email");
      return;
    }

    try {
      setSendingResetEmail(true);
      const response = await forgotPassword(resetEmail);
      alert(response.message);
      setShowForgotModal(false);
      setResetEmail("");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to send reset email");
    } finally {
      setSendingResetEmail(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-4 sm:px-6 py-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">
          {/* Left Section */}
          <div className="bg-[#0B1220] p-8 sm:p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute w-[300px] h-[300px] bg-[#5B5FEF]/30 rounded-full blur-3xl top-[-80px] right-[-80px]" />

            <div className="relative z-10">
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Background
                <br />
                Verification
                <br />
                System
              </h1>
              <p className="text-gray-400 mt-6 text-base sm:text-lg leading-relaxed max-w-md">
                Enterprise-grade platform for secure candidate verification,
                fraud detection, OCR validation, and compliance monitoring.
              </p>
            </div>

            {/* Bottom Stats */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 lg:mt-16">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Candidates</p>
                <h2 className="text-white text-3xl font-bold mt-2">1.2K</h2>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Verified</p>
                <h2 className="text-green-400 text-3xl font-bold mt-2">980</h2>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Fraud Alerts</p>
                <h2 className="text-red-400 text-3xl font-bold mt-2">80</h2>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-8 sm:p-10 lg:p-16 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-8 lg:mb-10">
                <p className="text-[#5B5FEF] font-semibold mb-3">
                  WELCOME BACK
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Sign In
                </h2>
                <p className="text-gray-500 mt-3">
                  Access your enterprise verification dashboard
                </p>
              </div>

              {/* Username */}
              <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-3">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-3 sm:py-4 outline-none focus:border-[#5B5FEF] transition-all"
                />
              </div>

              {/* Password */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-3">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-3 sm:py-4 pr-14 outline-none focus:border-[#5B5FEF] transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#5B5FEF]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[#5B5FEF] text-sm font-medium hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="w-full bg-[#5B5FEF] hover:bg-[#4B4FD8] transition-all text-white py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-lg"
              >
                Sign In
              </button>

              {/* Footer */}
              <p className="text-center text-gray-500 mt-8">
                Enterprise Background Verification Platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-[92%] sm:w-full max-w-md">
            <h2 className="text-2xl font-bold mb-3">Forgot Password</h2>
            <p className="text-gray-500 mb-6">Enter your email address.</p>

            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border rounded-xl px-4 py-3 mb-6"
            />

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                disabled={sendingResetEmail}
                className="px-5 py-2 bg-[#5B5FEF] text-white rounded-xl"
              >
                {sendingResetEmail ? "Sending..." : "Send Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
