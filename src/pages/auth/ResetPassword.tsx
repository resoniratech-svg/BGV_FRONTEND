import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {

  const navigate = useNavigate();

  const { token } = useParams();

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleResetPassword =
    async () => {

      if (
        !newPassword ||
        !confirmPassword
      ) {

        alert(
          "All fields are required"
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {

        alert(
          "Passwords do not match"
        );

        return;
      }

      try {

        setLoading(true);

  const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
  {
    new_password: newPassword
  }
);

        alert(
          response.data?.message 
        );

        navigate("/");

      } catch (error: any) {

        alert(
          error?.response?.data?.message ||
          "Password reset failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-10">

        <h1 className="text-3xl font-bold mb-3">
          Reset Password
        </h1>

        <p className="text-gray-500 mb-8">
          Enter your new password.
        </p>

        <div className="space-y-5">

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            className="w-full border rounded-xl px-4 py-4"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full border rounded-xl px-4 py-4"
          />

          <button
            onClick={
              handleResetPassword
            }
            disabled={
              loading
            }
            className="w-full bg-[#5B5FEF] text-white py-4 rounded-xl font-semibold"
          >
            {
              loading
                ? "Updating..."
                : "Reset Password"
            }
          </button>

        </div>

      </div>

    </div>

  );

}

export default ResetPassword;