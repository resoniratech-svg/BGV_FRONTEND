import React from "react";

interface PassportResultViewProps {
  data: any;
}

const PassportResultView: React.FC<PassportResultViewProps> = ({ data }) => {
  console.log("PASSPORT RESULT VIEW DATA:", data);

  // =====================================================
  // API RESPONSE STRUCTURE
  //
  // data
  // └── data
  //     ├── passport_information
  //     └── verification
  // =====================================================

  const response = data;

  const result = response?.data;

  const passportInformation = result?.data?.passport_information;

  const verification = result?.data?.verification;

  // =====================================================
  // NO RESULT
  // =====================================================

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">
          Passport result data is not available.
        </p>
      </div>
    );
  }

  // =====================================================
  // VALUES
  // =====================================================

  const verificationStatus =
    verification?.verification_status ||
    result?.verification_status ||
    "NOT_VERIFIED";

  const passportMatchStatus = verification?.passport_match_status || "N/A";

  const nameMatchStatus = verification?.name_match_status || "N/A";

  const dobMatchStatus = verification?.dob_match_status || "N/A";

  // =====================================================
  // HELPER
  // =====================================================

  const formatDate = (value: any) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const matchClass = (value: string) => {
    return value === "MATCH" ? "text-green-600" : "text-red-600";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">
      {/* =================================================
          VERIFICATION STATUS
      ================================================= */}

      <div className="border rounded-2xl p-5 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Verification Status</p>

            <p
              className={`text-xl font-bold mt-1 ${
                verificationStatus === "VERIFIED"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {verificationStatus}
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              verificationStatus === "VERIFIED"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {verificationStatus === "VERIFIED" ? "Verified" : "Not Verified"}
          </div>
        </div>
      </div>

      {/* =================================================
          PASSPORT INFORMATION
      ================================================= */}

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Passport Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Passport Number</p>

            <p className="font-semibold text-gray-900 mt-1">
              {passportInformation?.passport_number ||
                passportInformation?.document_id ||
                "N/A"}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Full Name</p>

            <p className="font-semibold text-gray-900 mt-1">
              {passportInformation?.full_name || "N/A"}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">File Number</p>

            <p className="font-semibold text-gray-900 mt-1">
              {passportInformation?.file_number || "N/A"}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Gender</p>

            <p className="font-semibold text-gray-900 mt-1">
              {passportInformation?.gender || "N/A"}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Date of Birth</p>

            <p className="font-semibold text-gray-900 mt-1">
              {formatDate(passportInformation?.date_of_birth)}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Nationality</p>

            <p className="font-semibold text-gray-900 mt-1">
              {passportInformation?.nationality || "N/A"}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Country</p>

            <p className="font-semibold text-gray-900 mt-1">
              {passportInformation?.country || "N/A"}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Issue Date</p>

            <p className="font-semibold text-gray-900 mt-1">
              {formatDate(passportInformation?.issue_date)}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Expiry Date</p>

            <p className="font-semibold text-gray-900 mt-1">
              {formatDate(passportInformation?.expiry_date)}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Place of Birth</p>

            <p className="font-semibold text-gray-900 mt-1">
              {passportInformation?.place_of_birth || "N/A"}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Place of Issue</p>

            <p className="font-semibold text-gray-900 mt-1">
              {passportInformation?.place_of_issue || "N/A"}
            </p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Guardian Name</p>

            <p className="font-semibold text-gray-900 mt-1">
              {passportInformation?.guardian_name || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          MATCH RESULTS
      ================================================= */}

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Verification Checks
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between border rounded-xl p-4">
            <span className="font-medium">Passport Number Match</span>

            <span className={`font-bold ${matchClass(passportMatchStatus)}`}>
              {passportMatchStatus}
            </span>
          </div>

          <div className="flex items-center justify-between border rounded-xl p-4">
            <span className="font-medium">Name Match</span>

            <span className={`font-bold ${matchClass(nameMatchStatus)}`}>
              {nameMatchStatus}
            </span>
          </div>

          <div className="flex items-center justify-between border rounded-xl p-4">
            <span className="font-medium">Date of Birth Match</span>

            <span className={`font-bold ${matchClass(dobMatchStatus)}`}>
              {dobMatchStatus}
            </span>
          </div>
        </div>
      </div>

      {/* =================================================
          MESSAGE
      ================================================= */}

      {result?.display_message && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm font-medium text-green-700">
            {result.display_message}
          </p>
        </div>
      )}
    </div>
  );
};

export default PassportResultView;
