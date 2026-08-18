import React from "react";

interface CourtRecordResultViewProps {
  data: any;
}

const CourtRecordResultView: React.FC<CourtRecordResultViewProps> = ({
  data,
}) => {
  if (!data) {
    return (
      <div className="p-6 text-gray-500">
        Court Record verification result not found.
      </div>
    );
  }

  // =========================================================
  // NORMALIZE RESPONSE
  // =========================================================

  const result = data?.data?.data ?? data?.data ?? data ?? {};

  // =========================================================
  // COMMON COURT RECORD FIELDS
  // =========================================================

  const verificationStatus =
    result?.verification_status ??
    result?.status ??
    data?.verification_status ??
    data?.status ??
    "";

  const riskLevel =
    result?.risk_level ?? result?.risk ?? data?.risk_level ?? "";

  const caseFound =
    result?.case_found ?? result?.cases_found ?? result?.match_found ?? "";

  const totalCases =
    result?.total_cases ?? result?.case_count ?? result?.number_of_cases ?? "";

  // =========================================================
  // HELPER
  // =========================================================

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === "") {
      return "Not Available";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  const normalizedStatus = String(verificationStatus).trim().toUpperCase();

  // =========================================================
  // STATUS DISPLAY
  // =========================================================

  const getStatusClass = () => {
    if (
      normalizedStatus === "VERIFIED" ||
      normalizedStatus === "CLEAR" ||
      normalizedStatus === "NO RECORD"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      normalizedStatus === "FRAUD" ||
      normalizedStatus === "MATCH FOUND" ||
      normalizedStatus === "CASE FOUND"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      normalizedStatus === "REJECTED" ||
      normalizedStatus === "NOT VERIFIED"
    ) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // =========================================================
  // CASE DATA
  // =========================================================

  const cases =
    result?.cases ??
    result?.court_cases ??
    result?.case_details ??
    result?.results ??
    [];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Court Record Verification
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Court and litigation record verification result
          </p>
        </div>

        {verificationStatus && (
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusClass()}`}
          >
            {formatValue(verificationStatus)}
          </span>
        )}
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4 bg-gray-50">
          <p className="text-xs text-gray-500 font-medium">
            Verification Status
          </p>

          <p className="text-sm font-bold text-gray-900 mt-1">
            {formatValue(verificationStatus)}
          </p>
        </div>

        <div className="border rounded-xl p-4 bg-gray-50">
          <p className="text-xs text-gray-500 font-medium">Risk Level</p>

          <p className="text-sm font-bold text-gray-900 mt-1">
            {formatValue(riskLevel)}
          </p>
        </div>

        <div className="border rounded-xl p-4 bg-gray-50">
          <p className="text-xs text-gray-500 font-medium">Cases Found</p>

          <p className="text-sm font-bold text-gray-900 mt-1">
            {formatValue(totalCases !== "" ? totalCases : caseFound)}
          </p>
        </div>
      </div>

      {/* =====================================================
          COURT CASES
      ===================================================== */}

      {Array.isArray(cases) && cases.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Court Cases</h3>

          {cases.map((courtCase: any, index: number) => (
            <div key={index} className="border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900">Case #{index + 1}</h4>

                {courtCase?.status && (
                  <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold">
                    {formatValue(courtCase.status)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courtCase?.case_number && (
                  <div>
                    <p className="text-xs text-gray-500">Case Number</p>

                    <p className="text-sm font-semibold text-gray-900">
                      {formatValue(courtCase.case_number)}
                    </p>
                  </div>
                )}

                {courtCase?.court_name && (
                  <div>
                    <p className="text-xs text-gray-500">Court</p>

                    <p className="text-sm font-semibold text-gray-900">
                      {formatValue(courtCase.court_name)}
                    </p>
                  </div>
                )}

                {courtCase?.case_type && (
                  <div>
                    <p className="text-xs text-gray-500">Case Type</p>

                    <p className="text-sm font-semibold text-gray-900">
                      {formatValue(courtCase.case_type)}
                    </p>
                  </div>
                )}

                {courtCase?.filing_date && (
                  <div>
                    <p className="text-xs text-gray-500">Filing Date</p>

                    <p className="text-sm font-semibold text-gray-900">
                      {formatValue(courtCase.filing_date)}
                    </p>
                  </div>
                )}

                {courtCase?.case_status && (
                  <div>
                    <p className="text-xs text-gray-500">Case Status</p>

                    <p className="text-sm font-semibold text-gray-900">
                      {formatValue(courtCase.case_status)}
                    </p>
                  </div>
                )}

                {courtCase?.state && (
                  <div>
                    <p className="text-xs text-gray-500">State</p>

                    <p className="text-sm font-semibold text-gray-900">
                      {formatValue(courtCase.state)}
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  RAW CASE DATA
              ================================================= */}

              <details className="border-t pt-4">
                <summary className="cursor-pointer text-xs font-bold text-gray-500">
                  View Complete Case Data
                </summary>

                <pre className="mt-3 bg-gray-50 rounded-xl p-4 text-xs whitespace-pre-wrap break-words overflow-x-auto">
                  {JSON.stringify(courtCase, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          RAW RESPONSE FALLBACK
      ===================================================== */}

      {(!Array.isArray(cases) || cases.length === 0) && (
        <div className="border rounded-2xl p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Verification Details
          </h3>

          <pre className="bg-gray-50 rounded-xl p-4 text-xs whitespace-pre-wrap break-words overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CourtRecordResultView;
