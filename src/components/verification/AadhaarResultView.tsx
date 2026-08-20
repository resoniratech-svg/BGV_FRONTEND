import React from "react";

interface AadhaarResultViewProps {
  data: any;
  candidateDocument?: any;
}

const AadhaarResultView: React.FC<AadhaarResultViewProps> = ({
  data,
  candidateDocument,
}) => {
  if (!data) {
    return (
      <div className="p-6 text-gray-500">
        Aadhaar verification result not found.
      </div>
    );
  }

  // =========================================================
  // NORMALIZE GRIDLINES RESULT
  // =========================================================

  const result = data?.data?.data ?? data?.data ?? data ?? {};

  const verificationStatus =
    result?.verification_status || data?.verification_status || "NOT AVAILABLE";

  const residentName = result?.resident_name || "-";

  const dateOfBirth = result?.date_of_birth || "-";

  const gender = result?.gender || "-";

  const address = result?.address || "-";

  const providerName = result?.provider_name || result?.provider || "GRIDLINES";

  const apiReferenceId = result?.api_reference_id || result?.request_id || "-";

  const nameMatchStatus = result?.name_match_status || "-";

  const dobMatchStatus = result?.dob_match_status || "-";

  const verifiedAt = result?.verified_at || null;

  const residentImage = result?.resident_image || null;

  // =========================================================
  // STATUS HELPERS
  // =========================================================

  const normalizeStatus = (value: any) =>
    String(value || "")
      .trim()
      .toUpperCase();

  const normalizedVerificationStatus = normalizeStatus(verificationStatus);

  const isVerified =
    normalizedVerificationStatus === "VERIFIED" ||
    normalizedVerificationStatus === "APPROVED";

  const matchClass = (value: any) =>
    normalizeStatus(value) === "MATCH" ? "text-green-600" : "text-red-500";

  // =========================================================
  // CANDIDATE DOCUMENT
  // =========================================================

  const API_URL = import.meta.env.VITE_API_URL || "";

  const candidateDocumentId =
    candidateDocument?.id ?? candidateDocument?.document_id ?? null;

  /*
   * Backend endpoint used to display the actual uploaded
   * candidate document.
   */
  const candidateDocumentUrl = candidateDocumentId
    ? `${API_URL}/documents/${candidateDocumentId}/view`
    : "";

  // =========================================================
  // DOCUMENT INFORMATION
  // =========================================================

  const mimeType = String(
    candidateDocument?.mime_type ||
      candidateDocument?.file_type ||
      candidateDocument?.content_type ||
      "",
  ).toLowerCase();

  const originalFilename = String(
    candidateDocument?.original_filename ||
      candidateDocument?.filename ||
      candidateDocument?.file_name ||
      candidateDocument?.name ||
      "Aadhaar Document",
  );

  const lowerFilename = originalFilename.toLowerCase();

  /*
   * IMPORTANT:
   *
   * Do not depend only on mime_type.
   *
   * Your uploaded file is .jpeg and the backend may not
   * return the MIME type correctly.
   */

  const isImage =
    mimeType.startsWith("image/") ||
    lowerFilename.endsWith(".jpg") ||
    lowerFilename.endsWith(".jpeg") ||
    lowerFilename.endsWith(".png") ||
    lowerFilename.endsWith(".webp") ||
    lowerFilename.endsWith(".gif");

  const isPdf =
    mimeType === "application/pdf" || lowerFilename.endsWith(".pdf");

  // =========================================================
  // DEBUG
  // =========================================================

  console.log("========== AADHAAR DOCUMENT ==========");

  console.log("Candidate Document:", candidateDocument);

  console.log("Candidate Document ID:", candidateDocumentId);

  console.log("Candidate Document URL:", candidateDocumentUrl);

  console.log("MIME Type:", mimeType);

  console.log("Original Filename:", originalFilename);

  console.log("Is Image:", isImage);

  console.log("Is PDF:", isPdf);

  console.log("======================================");

  return (
    <div className="w-full">
      {/* =====================================================
          MAIN REVIEW AREA
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ===================================================
            LEFT SIDE
            GRIDLINES RESULT
        ==================================================== */}

        <div className="space-y-6">
          {/* =================================================
              VERIFICATION STATUS
          ================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Verification Status
            </p>

            <p
              className={`mt-3 text-2xl font-bold ${
                isVerified ? "text-green-600" : "text-red-500"
              }`}
            >
              {verificationStatus}
            </p>
          </div>

          {/* =================================================
              GRIDLINES AADHAAR DETAILS
          ================================================== */}

          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-700">
              Gridlines Aadhaar Details
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* RESIDENT NAME */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">Resident Name</p>

                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {residentName}
                </p>
              </div>

              {/* DOB */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">Date of Birth</p>

                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {dateOfBirth}
                </p>
              </div>

              {/* GENDER */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">Gender</p>

                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {gender}
                </p>
              </div>

              {/* PROVIDER */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">Provider</p>

                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {providerName}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              ADDRESS
          ================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Address</p>

            <p className="mt-2 text-lg font-semibold leading-relaxed text-gray-900">
              {address}
            </p>
          </div>

          {/* =================================================
              GRIDLINES RESIDENT PHOTO
          ================================================== */}

          {residentImage && (
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-700">
                Aadhaar Photo From Gridlines
              </h3>

              <div className="flex justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <img
                  src={
                    String(residentImage).startsWith("data:")
                      ? residentImage
                      : `data:image/jpeg;base64,${residentImage}`
                  }
                  alt="Aadhaar Resident"
                  className="max-h-72 rounded-xl object-contain"
                />
              </div>
            </div>
          )}

          {/* =================================================
              VERIFICATION COMPARISON
          ================================================== */}

          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-700">
              Verification Comparison
            </h3>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Field
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Gridlines Result
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="px-5 py-4">Name</td>

                    <td
                      className={`px-5 py-4 font-bold ${matchClass(
                        nameMatchStatus,
                      )}`}
                    >
                      {nameMatchStatus}
                    </td>
                  </tr>

                  <tr className="border-t">
                    <td className="px-5 py-4">Date of Birth</td>

                    <td
                      className={`px-5 py-4 font-bold ${matchClass(
                        dobMatchStatus,
                      )}`}
                    >
                      {dobMatchStatus}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* =================================================
              API INFORMATION
          ================================================== */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* API REFERENCE */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">API Reference ID</p>

              <p className="mt-2 break-all font-semibold text-gray-900">
                {apiReferenceId}
              </p>
            </div>

            {/* VERIFIED AT */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Verified At</p>

              <p className="mt-2 font-semibold text-gray-900">
                {verifiedAt ? new Date(verifiedAt).toLocaleString() : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE
            CANDIDATE UPLOADED AADHAAR
        ==================================================== */}

        <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
          {/* =================================================
              HEADER
          ================================================== */}

          <div className="mb-5">
            <h3 className="text-xl font-bold text-gray-800">
              Candidate Uploaded Aadhaar
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Original document submitted by the candidate
            </p>
          </div>

          {/* =================================================
              DOCUMENT AVAILABLE
          ================================================== */}

          {candidateDocumentUrl ? (
            <>
              {/* =================================================
                  IMAGE PREVIEW
              ================================================== */}

              {isImage && (
                <div className="flex min-h-[550px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <img
                    src={candidateDocumentUrl}
                    alt="Candidate uploaded Aadhaar"
                    className="max-h-[700px] max-w-full rounded-xl object-contain shadow-sm"
                    onLoad={() => {
                      console.log(
                        "Candidate Aadhaar image loaded successfully",
                      );
                    }}
                    onError={(error) => {
                      console.error(
                        "FAILED TO LOAD CANDIDATE AADHAAR IMAGE",
                        error,
                      );

                      console.error("IMAGE URL:", candidateDocumentUrl);
                    }}
                  />
                </div>
              )}

              {/* =================================================
                  PDF PREVIEW
              ================================================== */}

              {isPdf && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <iframe
                    src={candidateDocumentUrl}
                    title="Candidate uploaded Aadhaar"
                    className="h-[700px] w-full rounded-xl"
                  />
                </div>
              )}

              {/* =================================================
                  UNKNOWN FORMAT
              ================================================== */}

              {!isImage && !isPdf && (
                <div className="flex min-h-[550px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-2xl">📄</span>
                  </div>

                  <p className="font-semibold text-gray-700">
                    Aadhaar document cannot be previewed
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Unsupported file format.
                  </p>

                  <p className="mt-3 break-all text-xs text-gray-400">
                    {originalFilename}
                  </p>
                </div>
              )}

              {/* =================================================
                  FILE INFORMATION
              ================================================== */}

              <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Uploaded File</p>

                <p className="mt-2 break-all font-semibold text-gray-900">
                  {originalFilename}
                </p>

                {mimeType && (
                  <p className="mt-1 text-sm text-gray-500">{mimeType}</p>
                )}
              </div>
            </>
          ) : (
            /* =================================================
               DOCUMENT NOT FOUND
            ================================================== */

            <div className="flex min-h-[550px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <span className="text-2xl">📄</span>
              </div>

              <p className="font-semibold text-gray-700">
                Candidate Aadhaar not found
              </p>

              <p className="mt-2 text-sm text-gray-500">
                The candidate has not uploaded an Aadhaar document.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AadhaarResultView;
