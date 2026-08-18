type DrivingLicenseResultViewProps = {
  data: any;
};

const DrivingLicenseResultView = ({ data }: DrivingLicenseResultViewProps) => {
  console.log("==================================================");
  console.log("DRIVING LICENSE RESULT VIEW DATA:", data);
  console.log("==================================================");

  // =====================================================
  // NORMALIZE API RESPONSE
  // =====================================================
  //
  // Different API calls in the application can return
  // different levels of "data" wrapping.
  //
  // Supported:
  //
  // data
  // data.data
  // data.data.data
  //
  // We normalize it here so the rest of the component
  // works consistently.
  // =====================================================

  const result = data?.data?.data ?? data?.data ?? data ?? {};

  console.log("NORMALIZED DRIVING LICENSE RESULT:", result);

  // =====================================================
  // VERIFICATION STATUS
  // =====================================================

  const verificationStatus = result?.verification_status ?? "";

  console.log("DRIVING LICENSE VERIFICATION STATUS:", verificationStatus);

  // =====================================================
  // DRIVING LICENSE DETAILS
  // =====================================================

  const licenseNumber = result?.license_number ?? "";

  const fullName = result?.full_name ?? "";

  const dependentName = result?.dependent_name ?? "";

  const dateOfBirth = result?.date_of_birth ?? "";

  const issueDate = result?.issue_date ?? "";

  const expiryDate = result?.expiry_date ?? "";

  const placeOfIssue = result?.place_of_issue ?? "";

  const address = result?.address ?? "";

  // =====================================================
  // COMPARISON RESULTS
  // =====================================================
  //
  // Fresh verification response:
  //
  // comparison:
  // {
  //   driving_license_number: "MATCH",
  //   name: "MATCH",
  //   date_of_birth: "MATCH",
  //   address: "MATCH"
  // }
  //
  // Saved database result:
  //
  // {
  //   dl_number_match_status: "MATCH",
  //   name_match_status: "MATCH",
  //   dob_match_status: "MATCH",
  //   address_match_status: "MATCH"
  // }
  //
  // Support BOTH formats.
  // =====================================================

  const drivingLicenseNumberMatch =
    result?.comparison?.driving_license_number ??
    result?.comparison?.dl_number ??
    result?.dl_number_match_status ??
    result?.driving_license_number_match_status ??
    "";

  const nameMatch = result?.comparison?.name ?? result?.name_match_status ?? "";

  const dateOfBirthMatch =
    result?.comparison?.date_of_birth ??
    result?.comparison?.dob ??
    result?.dob_match_status ??
    "";

  const addressMatch =
    result?.comparison?.address ?? result?.address_match_status ?? "";

  const comparison = {
    driving_license_number: drivingLicenseNumberMatch,
    name: nameMatch,
    date_of_birth: dateOfBirthMatch,
    address: addressMatch,
  };

  console.log("==================================================");

  console.log("NORMALIZED DRIVING LICENSE COMPARISON:", comparison);

  console.log("==================================================");

  // =====================================================
  // DATE FORMATTER
  // =====================================================
  //
  // Backend may return:
  //
  // 2002-06-13
  //
  // or a JavaScript Date string such as:
  //
  // Thu, 13 Jun 2002 00:00:00 GMT
  //
  // Display it consistently as:
  //
  // 13 Jun 2002
  //
  // =====================================================

  const formatDate = (value: any) => {
    if (!value) {
      return "";
    }

    // Already a Date object
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return "";
      }

      return value.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    const stringValue = String(value).trim();

    if (!stringValue) {
      return "";
    }

    // Handle YYYY-MM-DD without timezone conversion.
    //
    // This prevents a date such as 2002-06-13 from
    // accidentally becoming 12 Jun in some timezones.
    const isoDateMatch = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;

      const date = new Date(Number(year), Number(month) - 1, Number(day));

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    // Handle normal date strings returned by backend.
    const parsedDate = new Date(stringValue);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    // If parsing fails, display the original value.
    return stringValue;
  };

  // =====================================================
  // FORMAT DISPLAY DATES
  // =====================================================

  const formattedDateOfBirth = formatDate(dateOfBirth);

  const formattedIssueDate = formatDate(issueDate);

  const formattedExpiryDate = formatDate(expiryDate);

  // =====================================================
  // MATCH CLASS
  // =====================================================

  const getMatchClass = (value: any) => {
    const normalizedValue = String(value ?? "")
      .trim()
      .toUpperCase();

    if (normalizedValue === "MATCH") {
      return "text-green-600 font-semibold";
    }

    if (
      normalizedValue === "MISMATCH" ||
      normalizedValue === "NOT MATCH" ||
      normalizedValue === "NOT_MATCH"
    ) {
      return "text-red-600 font-semibold";
    }

    // Do not show missing/unknown data as a false mismatch.
    return "text-gray-500 font-semibold";
  };

  // =====================================================
  // MATCH LABEL
  // =====================================================

  const getMatchLabel = (value: any) => {
    const normalizedValue = String(value ?? "")
      .trim()
      .toUpperCase();

    if (normalizedValue === "MATCH") {
      return "MATCH";
    }

    if (
      normalizedValue === "MISMATCH" ||
      normalizedValue === "NOT MATCH" ||
      normalizedValue === "NOT_MATCH"
    ) {
      return "NOT MATCH";
    }

    return "—";
  };

  // =====================================================
  // VERIFICATION STATUS CLASS
  // =====================================================

  const normalizedVerificationStatus = String(verificationStatus ?? "")
    .trim()
    .toUpperCase();

  const isApproved =
    normalizedVerificationStatus === "APPROVED" ||
    normalizedVerificationStatus === "VERIFIED";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          VERIFICATION STATUS
      ===================================================== */}

      <div className="border rounded-2xl p-5 bg-gray-50">
        <div className="text-xs font-bold text-gray-500 uppercase mb-2">
          Verification Status
        </div>

        <div
          className={`text-lg font-bold ${
            isApproved
              ? "text-green-600"
              : normalizedVerificationStatus === "FAILED" ||
                  normalizedVerificationStatus === "REJECTED"
                ? "text-red-600"
                : "text-gray-600"
          }`}
        >
          {verificationStatus || "UNKNOWN"}
        </div>
      </div>

      {/* =====================================================
          DRIVING LICENSE DETAILS
      ===================================================== */}

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">
          Driving License Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* License Number */}

          <div className="border rounded-xl p-4">
            <div className="text-xs text-gray-500">License Number</div>

            <div className="font-semibold mt-1">{licenseNumber || "—"}</div>
          </div>

          {/* Full Name */}

          <div className="border rounded-xl p-4">
            <div className="text-xs text-gray-500">Full Name</div>

            <div className="font-semibold mt-1">{fullName || "—"}</div>
          </div>

          {/* Dependent Name */}

          <div className="border rounded-xl p-4">
            <div className="text-xs text-gray-500">Dependent Name</div>

            <div className="font-semibold mt-1">{dependentName || "—"}</div>
          </div>

          {/* Date of Birth */}

          <div className="border rounded-xl p-4">
            <div className="text-xs text-gray-500">Date of Birth</div>

            <div className="font-semibold mt-1">
              {formattedDateOfBirth || "—"}
            </div>
          </div>

          {/* Issue Date */}

          <div className="border rounded-xl p-4">
            <div className="text-xs text-gray-500">Issue Date</div>

            <div className="font-semibold mt-1">
              {formattedIssueDate || "—"}
            </div>
          </div>

          {/* Expiry Date */}

          <div className="border rounded-xl p-4">
            <div className="text-xs text-gray-500">Expiry Date</div>

            <div className="font-semibold mt-1">
              {formattedExpiryDate || "—"}
            </div>
          </div>

          {/* Place of Issue */}

          <div className="border rounded-xl p-4">
            <div className="text-xs text-gray-500">Place of Issue</div>

            <div className="font-semibold mt-1">{placeOfIssue || "—"}</div>
          </div>

          {/* Address */}

          <div className="border rounded-xl p-4 md:col-span-2">
            <div className="text-xs text-gray-500">Address</div>

            <div className="font-semibold mt-1">{address || "—"}</div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MATCH RESULTS
      ===================================================== */}

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">
          Verification Comparison
        </h3>

        <div className="border rounded-2xl overflow-hidden">
          {/* Header */}

          <div className="grid grid-cols-2 bg-gray-50 px-4 py-3">
            <div className="text-xs font-bold text-gray-500">Field</div>

            <div className="text-xs font-bold text-gray-500">Result</div>
          </div>

          {/* =================================================
              LICENSE NUMBER
          ================================================= */}

          <div className="grid grid-cols-2 px-4 py-4 border-t">
            <div className="text-sm">Driving License Number</div>

            <div className={getMatchClass(comparison.driving_license_number)}>
              {getMatchLabel(comparison.driving_license_number)}
            </div>
          </div>

          {/* =================================================
              NAME
          ================================================= */}

          <div className="grid grid-cols-2 px-4 py-4 border-t">
            <div className="text-sm">Name</div>

            <div className={getMatchClass(comparison.name)}>
              {getMatchLabel(comparison.name)}
            </div>
          </div>

          {/* =================================================
              DATE OF BIRTH
          ================================================= */}

          <div className="grid grid-cols-2 px-4 py-4 border-t">
            <div className="text-sm">Date of Birth</div>

            <div className={getMatchClass(comparison.date_of_birth)}>
              {getMatchLabel(comparison.date_of_birth)}
            </div>
          </div>

          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="grid grid-cols-2 px-4 py-4 border-t">
            <div className="text-sm">Address</div>

            <div className={getMatchClass(comparison.address)}>
              {getMatchLabel(comparison.address)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrivingLicenseResultView;
