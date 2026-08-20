import React from "react";

interface AadhaarVerificationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
}

const AadhaarVerificationResultModal: React.FC<
  AadhaarVerificationResultModalProps
> = ({ isOpen, onClose, result }) => {
  if (!isOpen) {
    return null;
  }

  if (!result) {
    return null;
  }

  const status = result.verification_status || "PENDING";

  const residentImage = result.resident_image
    ? `data:image/jpeg;base64,${result.resident_image}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Aadhaar Verification Result
          </h2>

          <button
            onClick={onClose}
            className="text-red-500 font-semibold hover:text-red-600"
          >
            Close
          </button>
        </div>

        <div className="px-8 pb-8">
          {/* ================================================== */}
          {/* VERIFICATION STATUS */}
          {/* ================================================== */}

          <div className="rounded-2xl border border-gray-200 p-6 mb-7">
            <p className="text-sm font-semibold text-gray-500 uppercase">
              Verification Status
            </p>

            <p
              className={`mt-3 text-xl font-bold ${
                status === "VERIFIED" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status}
            </p>
          </div>

          {/* ================================================== */}
          {/* AADHAAR DETAILS */}
          {/* ================================================== */}

          <h3 className="mb-4 text-lg font-semibold text-gray-700">
            Aadhaar Details
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Resident Name */}

            <div className="rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Resident Name</p>

              <p className="mt-2 text-lg font-semibold text-gray-900">
                {result.resident_name || "-"}
              </p>
            </div>

            {/* Date of Birth */}

            <div className="rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Date of Birth</p>

              <p className="mt-2 text-lg font-semibold text-gray-900">
                {result.date_of_birth || "-"}
              </p>
            </div>

            {/* Gender */}

            <div className="rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Gender</p>

              <p className="mt-2 text-lg font-semibold text-gray-900">
                {result.gender || "-"}
              </p>
            </div>

            {/* Provider */}

            <div className="rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Verification Provider</p>

              <p className="mt-2 text-lg font-semibold text-gray-900">
                {result.provider_name || "-"}
              </p>
            </div>
          </div>

          {/* ================================================== */}
          {/* ADDRESS */}
          {/* ================================================== */}

          <div className="mt-5 rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Address</p>

            <p className="mt-2 text-lg font-semibold leading-relaxed text-gray-900">
              {result.address || "-"}
            </p>
          </div>

          {/* ================================================== */}
          {/* AADHAAR PHOTO */}
          {/* ================================================== */}

          {residentImage && (
            <div className="mt-7">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Aadhaar Photo
              </h3>

              <div className="flex justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <img
                  src={residentImage}
                  alt="Aadhaar Resident"
                  className="max-h-72 rounded-xl object-contain"
                />
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* VERIFICATION COMPARISON */}
          {/* ================================================== */}

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              Verification Comparison
            </h3>

            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Field
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Result
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="px-5 py-4">Name</td>

                    <td className="px-5 py-4 font-semibold text-green-600">
                      {result.name_match_status || "VERIFIED"}
                    </td>
                  </tr>

                  <tr className="border-t">
                    <td className="px-5 py-4">Date of Birth</td>

                    <td className="px-5 py-4 font-semibold text-green-600">
                      {result.dob_match_status || "VERIFIED"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ================================================== */}
          {/* VERIFIED AT */}
          {/* ================================================== */}

          <div className="mt-7 text-sm text-gray-500">
            Verified at:{" "}
            {result.verified_at
              ? new Date(result.verified_at).toLocaleString()
              : "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AadhaarVerificationResultModal;
