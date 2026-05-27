import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (email && password) {

      localStorage.setItem(
        "token",
        "mock-jwt-token"
      );

      navigate("/dashboard");

    } else {

      alert("Enter email and password");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-6">

      <div className="w-full max-w-6xl grid grid-cols-2 bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">

        {/* Left Section */}
        <div className="bg-[#0B1220] p-16 flex flex-col justify-between relative overflow-hidden">

          {/* Glow Effect */}
          <div className="absolute w-[300px] h-[300px] bg-[#5B5FEF]/30 rounded-full blur-3xl top-[-80px] right-[-80px]" />

          <div className="relative z-10">

            <h1 className="text-white text-5xl font-bold leading-tight">
              Background
              <br />
              Verification
              <br />
              System
            </h1>

            <p className="text-gray-400 mt-6 text-lg leading-relaxed max-w-md">
              Enterprise-grade platform for secure
              candidate verification, fraud detection,
              OCR validation, and compliance monitoring.
            </p>

          </div>

          {/* Bottom Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-4 mt-16">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

              <p className="text-gray-400 text-sm">
                Candidates
              </p>

              <h2 className="text-white text-3xl font-bold mt-2">
                1.2K
              </h2>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

              <p className="text-gray-400 text-sm">
                Verified
              </p>

              <h2 className="text-green-400 text-3xl font-bold mt-2">
                980
              </h2>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

              <p className="text-gray-400 text-sm">
                Fraud Alerts
              </p>

              <h2 className="text-red-400 text-3xl font-bold mt-2">
                80
              </h2>

            </div>

          </div>

        </div>

        {/* Right Section */}
        <div className="p-16 flex items-center">

          <div className="w-full max-w-md mx-auto">

            <div className="mb-10">

              <p className="text-[#5B5FEF] font-semibold mb-3">
                WELCOME BACK
              </p>

              <h2 className="text-4xl font-bold text-gray-900">
                Sign In
              </h2>

              <p className="text-gray-500 mt-3">
                Access your enterprise verification dashboard
              </p>

            </div>

            {/* Email */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-3">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#5B5FEF] transition-all"
              />

            </div>

            {/* Password */}
            <div className="mb-8">

              <label className="block text-gray-700 font-medium mb-3">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#5B5FEF] transition-all"
              />

            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-[#5B5FEF] hover:bg-[#4B4FD8] transition-all text-white py-4 rounded-2xl font-semibold text-lg shadow-lg"
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
  );
}

export default Login;