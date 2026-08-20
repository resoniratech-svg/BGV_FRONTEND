// type Props = {
//   data: any;
// };

// export default function FaceMatchResultView({ data }: Props) {
//   const result = data?.data?.data;

//   return (
//     <div className="space-y-4">
//       <div>
//         <b>Status :</b>

//         {result?.verification_status}
//       </div>

//       <div>
//         <b>Confidence :</b>

//         {result?.confidence_score}
//       </div>

//       <div>
//         <b>Message :</b>

//         {result?.display_message}
//       </div>
//     </div>
//   );
// }
type Props = {
  data: any;
  aadhaarImageUrl?: string;
  selfieImageUrl?: string;
};

export default function FaceMatchResultView({
  data,
  aadhaarImageUrl,
  selfieImageUrl,
}: Props) {
  // =====================================================
  // GET FACE MATCH RESULT
  // =====================================================

  const result = data?.data?.data ?? data?.data ?? data ?? {};

  // =====================================================
  // STATUS
  // =====================================================

  const status = String(result?.verification_status ?? "")
    .trim()
    .toUpperCase();

  // =====================================================
  // CONFIDENCE
  // =====================================================

  const confidence = Number(result?.confidence_score ?? 0);

  // =====================================================
  // MESSAGE
  // =====================================================

  const message =
    result?.display_message ??
    (status === "MATCH"
      ? "Face matches Aadhaar image"
      : "Face does not match Aadhaar image");

  // =====================================================
  // GRIDLINES AADHAAR RESIDENT IMAGE
  // =====================================================

  const residentImage = result?.resident_image ?? null;

  // =====================================================
  // IMAGE URL HELPER
  //
  // Supports:
  // - HTTP / HTTPS URLs
  // - data:image/... URLs
  // - JPEG Base64
  // - PNG Base64
  // - GIF Base64
  // - WEBP Base64
  // - backend-relative paths
  // =====================================================

  const getImageUrl = (image: string | null | undefined): string | null => {
    if (!image) {
      return null;
    }

    const value = String(image).trim();

    if (!value) {
      return null;
    }

    // ---------------------------------------------------
    // Already a complete data URL
    // ---------------------------------------------------

    if (value.startsWith("data:image/")) {
      return value;
    }

    // ---------------------------------------------------
    // Normal HTTP / HTTPS URL
    // ---------------------------------------------------

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    // ---------------------------------------------------
    // Blob URL
    // ---------------------------------------------------

    if (value.startsWith("blob:")) {
      return value;
    }

    // ---------------------------------------------------
    // JPEG Base64
    //
    // /9j/4AAQ...
    // ---------------------------------------------------

    if (value.startsWith("/9j/")) {
      return `data:image/jpeg;base64,${value}`;
    }

    // ---------------------------------------------------
    // PNG Base64
    //
    // iVBORw0KGgo...
    // ---------------------------------------------------

    if (value.startsWith("iVBORw0KGgo")) {
      return `data:image/png;base64,${value}`;
    }

    // ---------------------------------------------------
    // GIF Base64
    // ---------------------------------------------------

    if (value.startsWith("R0lGODlh") || value.startsWith("R0lGODdh")) {
      return `data:image/gif;base64,${value}`;
    }

    // ---------------------------------------------------
    // WEBP Base64
    // ---------------------------------------------------

    if (value.startsWith("UklGR")) {
      return `data:image/webp;base64,${value}`;
    }

    // ---------------------------------------------------
    // Other Base64 image
    //
    // Keep JPEG as the final fallback because Gridlines
    // Aadhaar resident images are normally JPEG.
    // ---------------------------------------------------

    const looksLikeBase64 =
      /^[A-Za-z0-9+/]+={0,2}$/.test(value) && value.length > 100;

    if (looksLikeBase64) {
      return `data:image/jpeg;base64,${value}`;
    }

    // ---------------------------------------------------
    // Backend-relative image path
    //
    // Example:
    // /uploads/selfies/abc.jpg
    //
    // Keep it unchanged so the existing API/base URL
    // handling can resolve it.
    // ---------------------------------------------------

    return value;
  };

  // =====================================================
  // AADHAAR REFERENCE IMAGE
  //
  // PRIORITY:
  //
  // 1. Gridlines resident_image
  // 2. Existing aadhaarImageUrl fallback
  //
  // IMPORTANT:
  // We intentionally prefer resident_image so the
  // uploaded Aadhaar card is NOT shown here.
  // =====================================================

  const referenceImageUrl =
    getImageUrl(residentImage) ?? getImageUrl(aadhaarImageUrl);

  // =====================================================
  // CANDIDATE SELFIE
  // =====================================================

  const candidateSelfieUrl = getImageUrl(selfieImageUrl);

  return (
    <div className="space-y-6">
      {/* ========================================= */}
      {/* IMAGES */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ========================================= */}
        {/* AADHAAR / REFERENCE IMAGE */}
        {/* ========================================= */}

        <div className="border border-gray-200 rounded-2xl p-4">
          <h3 className="font-bold text-gray-900 mb-3">
            Aadhaar / Reference Image
          </h3>

          <div className="bg-gray-50 rounded-xl overflow-hidden h-[280px] flex items-center justify-center">
            {referenceImageUrl ? (
              <img
                src={referenceImageUrl}
                alt="Aadhaar resident reference"
                className="w-full h-full object-contain"
                onError={(event) => {
                  console.error(
                    "Failed to load Aadhaar reference image:",
                    referenceImageUrl,
                  );

                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="text-sm text-gray-400">
                Aadhaar reference image unavailable
              </span>
            )}
          </div>
        </div>

        {/* ========================================= */}
        {/* CANDIDATE SELFIE */}
        {/* ========================================= */}

        <div className="border border-gray-200 rounded-2xl p-4">
          <h3 className="font-bold text-gray-900 mb-3">Candidate Selfie</h3>

          <div className="bg-gray-50 rounded-xl overflow-hidden h-[280px] flex items-center justify-center">
            {candidateSelfieUrl ? (
              <img
                src={candidateSelfieUrl}
                alt="Candidate selfie"
                className="w-full h-full object-contain"
                onError={(event) => {
                  console.error(
                    "Failed to load candidate selfie image:",
                    candidateSelfieUrl,
                  );

                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="text-sm text-gray-400">
                Selfie image unavailable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* RESULT */}
      {/* ========================================= */}

      <div className="border border-gray-200 rounded-2xl p-5 space-y-4">
        {/* ========================================= */}
        {/* STATUS */}
        {/* ========================================= */}

        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Status</span>

          <span
            className={`px-3 py-1 rounded-lg text-sm font-bold ${
              status === "MATCH"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status || "UNKNOWN"}
          </span>
        </div>

        {/* ========================================= */}
        {/* CONFIDENCE */}
        {/* ========================================= */}

        <div className="flex justify-between">
          <span className="font-bold text-gray-700">Confidence</span>

          <span className="font-semibold text-gray-900">
            {confidence.toFixed(4)}
          </span>
        </div>

        {/* ========================================= */}
        {/* MESSAGE */}
        {/* ========================================= */}

        <div>
          <span className="font-bold text-gray-700">Message</span>

          <p className="mt-1 text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}
