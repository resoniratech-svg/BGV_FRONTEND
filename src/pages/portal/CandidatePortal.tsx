import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import type { Candidate } from "../../types/Candidate";
import {
  validateCandidateLink,
  uploadCandidateDocument,
  submitCandidateDocuments,
  updateCandidateStatusApi,
} from "../../api/candidateApi";
import { saveCandidateConsent } from "../../api/consentApi";
// import { createAadhaarSession, fetchAadhaarResult } from "../../api/aadhaarApi";
import { saveAadhaarResult } from "../../api/aadhaarApi";
import { saveBankStatementDetails } from "../../api/bankStatementApi";
declare global {
  interface Window {
    AadhaarOVSESDK: any;
  }
}

function CandidatePortal() {
  const { secureToken } = useParams<{
    secureToken: string;
  }>();

  const GRIDLINES_API_KEY = import.meta.env.VITE_GRIDLINES_API_KEY;
  const GRIDLINES_ENV = import.meta.env.VITE_GRIDLINES_ENV;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);
  const [employmentConsent, setEmploymentConsent] = useState(false);
  const [creditBureauConsent, setCreditBureauConsent] = useState(false);
  const [courtRecordConsent, setCourtRecordConsent] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankStatementPassword, setBankStatementPassword] = useState("");
  const [savingBankDetails, setSavingBankDetails] = useState(false);
  const [savingEmploymentConsent, setSavingEmploymentConsent] = useState(false);
  const [savingCreditBureauConsent, setSavingCreditBureauConsent] =
    useState(false);
  const [savingCourtRecordConsent, setSavingCourtRecordConsent] =
    useState(false);
  const [bankStatementConsent, setBankStatementConsent] = useState(false);

  const [savingBankStatementConsent, setSavingBankStatementConsent] =
    useState(false);
  // Aadhaar States
  const [aadhaarStatus, setAadhaarStatus] = useState<
    "NOT_STARTED" | "INITIALIZING" | "VERIFYING" | "SUCCESS" | "REJECTED"
  >("NOT_STARTED");
  const [loadingConsent, setLoadingConsent] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  // Document Upload States
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const hasBankStatement = !!uploadedFiles["Bank Statement"];
  useEffect(() => {
    const loadPortal = async () => {
      try {
        const response = await validateCandidateLink(secureToken!);
        if (response.status === "already_uploaded") {
          setAlreadyUploaded(true);
          return;
        }
        console.log(response.data);
        setCandidate(response.data);
      } catch (error) {
        console.error(error);
        alert("Invalid or expired link");
      }
    };

    if (secureToken) {
      loadPortal();
    }
  }, [secureToken]);

  useEffect(() => {
    const checkSDK = () => {
      if (window.AadhaarOVSESDK) {
        setIsSdkLoaded(true);

        return true;
      }

      return false;
    };

    if (checkSDK()) {
      return;
    }

    const interval = setInterval(() => {
      if (checkSDK()) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);

      window.AadhaarOVSESDK?.unmount?.();
    };
  }, []);

  const docTypes = [
    "Selfie",
    "Aadhaar",
    "PAN",
    "Passport",
    "Driving License",
    "Bank Statement",
    "Salary Slip",
    "Resume",
  ];

  const triggerUpload = (docName: string) => {
    setActiveDoc(docName);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !activeDoc || !candidate) {
      return;
    }

    try {
      const response = await uploadCandidateDocument(
        secureToken!,
        activeDoc,
        file,
      );

      console.log("DOCUMENT UPLOAD RESPONSE:", response);
      const uploadedDocumentId =
        response?.data?.document_id ??
        response?.document_id ??
        response?.data?.id ??
        response?.id;
      console.log("UPLOADED DOCUMENT ID:", uploadedDocumentId);
      const isMulti = activeDoc === "Salary Slip";

      setUploadedFiles((prev) => {
        const uploadedDocument = {
          document_id: uploadedDocumentId,
          file_name: file.name,
        };

        if (isMulti) {
          const existing = Array.isArray(prev[activeDoc])
            ? prev[activeDoc]
            : [];

          return {
            ...prev,
            [activeDoc]: [...existing, uploadedDocument],
          };
        }

        return {
          ...prev,
          [activeDoc]: uploadedDocument,
        };
      });
    } catch (error) {
      console.error("DOCUMENT UPLOAD ERROR:", error);
      alert("Upload failed");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const removeFile = (doc: string, index: number) => {
    setUploadedFiles((prev) => {
      const files = Array.isArray(prev[doc]) ? [...prev[doc]] : [];
      files.splice(index, 1);

      return {
        ...prev,
        [doc]: files.length > 0 ? files : null,
      };
    });
  };

  const handleConsent = async () => {
    try {
      if (!window.AadhaarOVSESDK) {
        alert("Gridlines Aadhaar SDK is not loaded.");

        return;
      }

      if (!candidate) {
        alert("Candidate information is not available.");

        return;
      }

      if (!GRIDLINES_API_KEY || !GRIDLINES_ENV) {
        alert("Gridlines SDK configuration is missing.");

        return;
      }

      setLoadingConsent(true);

      setAadhaarStatus("INITIALIZING");

      window.AadhaarOVSESDK.init({
        container: "#sdk-mount-point",

        apiKey: GRIDLINES_API_KEY,

        environment: GRIDLINES_ENV,

        onSuccess: async (data: any) => {
          console.log("========== GRIDLINES SUCCESS ==========");
          console.log("SDK success data:", data);

          try {
            setAadhaarStatus("VERIFYING");

            if (!secureToken) {
              throw new Error("Secure token is missing.");
            }

            console.log("Saving Aadhaar result...");
            console.log("Secure token:", secureToken);

            const result = await saveAadhaarResult(secureToken, data);

            console.log("========== AADHAAR SAVE RESPONSE ==========");
            console.log(result);

            if (!result?.success) {
              throw new Error(
                result?.message || "Failed to save Aadhaar result.",
              );
            }

            setAadhaarStatus("SUCCESS");

            window.AadhaarOVSESDK?.unmount?.();
          } catch (error) {
            console.error("========== AADHAAR RESULT SAVE ERROR ==========");

            console.error(error);

            setAadhaarStatus("REJECTED");

            window.AadhaarOVSESDK?.unmount?.();
          }
        },

        onError: (error: any) => {
          console.error("========== GRIDLINES ERROR ==========");
          console.error("Full error:", error);
          console.error("JSON:", JSON.stringify(error, null, 2));

          setAadhaarStatus("REJECTED");

          window.AadhaarOVSESDK?.unmount?.();
        },

        onCancel: () => {
          console.log("========== GRIDLINES CANCEL ==========");

          setAadhaarStatus("NOT_STARTED");

          window.AadhaarOVSESDK?.unmount?.();
        },
      });
    } catch (error) {
      console.error("Aadhaar SDK initialization error:", error);

      setAadhaarStatus("REJECTED");
    } finally {
      setLoadingConsent(false);
    }
  };

  const submitAll = async () => {
    // =====================================================
    // EMPLOYMENT CONSENT VALIDATION
    // =====================================================

    if (!employmentConsent) {
      alert(
        "Please provide your consent for Employment Verification before submitting.",
      );
      return;
    }
    // =====================================================
    // CREDIT BUREAU CONSENT VALIDATION
    // =====================================================

    if (!creditBureauConsent) {
      alert(
        "Please provide your consent for Credit Bureau Verification before submitting.",
      );
      return;
    }
    // =====================================================
    // COURT RECORD CONSENT VALIDATION
    // =====================================================

    if (!courtRecordConsent) {
      alert(
        "Please provide your consent for Court Record Verification before submitting.",
      );
      return;
    }
    // =====================================================
    // DRIVING LICENSE FRONT + BACK VALIDATION
    // =====================================================

    const hasDrivingLicenseFront = !!uploadedFiles["Driving License Front"];

    const hasDrivingLicenseBack = !!uploadedFiles["Driving License Back"];

    if (hasDrivingLicenseFront && !hasDrivingLicenseBack) {
      alert("Please upload the Driving License Back side before submitting.");
      return;
    }

    if (!hasDrivingLicenseFront && hasDrivingLicenseBack) {
      alert("Please upload the Driving License Front side before submitting.");
      return;
    }

    // =====================================================
    // BANK STATEMENT VALIDATION
    // =====================================================

    if (hasBankStatement) {
      if (!bankName.trim()) {
        alert("Please enter your Bank Name.");
        return;
      }

      if (!bankStatementPassword.trim()) {
        alert("Please enter your Bank Statement Password.");
        return;
      }
    }

    // =====================================================
    // BANK STATEMENT CONSENT VALIDATION
    // =====================================================

    if (hasBankStatement && !bankStatementConsent) {
      alert(
        "Please provide your consent for Bank Statement Verification before submitting.",
      );
      return;
    }
    // =====================================================
    // GENERAL DOCUMENT VALIDATION
    // =====================================================

    if (Object.keys(uploadedFiles).length === 0) {
      alert("Please upload at least one document.");
      return;
    }
    // =====================================================
    // CANDIDATE VALIDATION
    // =====================================================

    if (!candidate) {
      alert("Candidate information is missing.");
      return;
    }

    // =====================================================
    // BGV ID VALIDATION
    // =====================================================

    if (!candidate.bgv_id) {
      alert("BGV ID is missing. Please contact the administrator.");
      return;
    }

    try {
      setIsUploading(true);
      // =====================================================
      // SAVE BANK STATEMENT DETAILS
      // =====================================================

      if (hasBankStatement) {
        setSavingBankDetails(true);

        const bankDetailsResponse = await saveBankStatementDetails(
          secureToken!,
          bankName.trim(),
          bankStatementPassword.trim(),
        );

        console.log(
          "BANK STATEMENT DETAILS SAVE RESPONSE:",
          bankDetailsResponse,
        );

        if (!bankDetailsResponse?.success) {
          throw new Error(
            bankDetailsResponse?.message ||
              "Failed to save Bank Statement details.",
          );
        }
      }
      // =====================================================
      // SAVE EMPLOYMENT CONSENT
      // =====================================================

      setSavingEmploymentConsent(true);

      const consentResponse = await saveCandidateConsent(
        candidate.id,
        candidate.bgv_id,
        "EMPLOYMENT",
        "I give my consent to verify my employment history and employment records for the purpose of background verification.",
      );

      console.log("EMPLOYMENT CONSENT RESPONSE:", consentResponse);

      if (!consentResponse?.success) {
        throw new Error(
          consentResponse?.message || "Failed to save Employment consent.",
        );
      }
      // =====================================================
      // SAVE CREDIT BUREAU CONSENT
      // =====================================================

      setSavingCreditBureauConsent(true);

      const creditBureauConsentResponse = await saveCandidateConsent(
        candidate.id,
        candidate.bgv_id,
        "CREDIT_BUREAU",
        "I give my consent to obtain, access, and verify my credit information and credit bureau records for the purpose of background verification.",
      );

      console.log(
        "CREDIT BUREAU CONSENT RESPONSE:",
        creditBureauConsentResponse,
      );

      if (!creditBureauConsentResponse?.success) {
        throw new Error(
          creditBureauConsentResponse?.message ||
            "Failed to save Credit Bureau consent.",
        );
      }
      // =====================================================
      // SAVE COURT RECORD CONSENT
      // =====================================================

      setSavingCourtRecordConsent(true);

      const courtRecordConsentResponse = await saveCandidateConsent(
        candidate.id,
        candidate.bgv_id,
        "CCRV",
        "I give my consent to search, access, and verify court and criminal record information for the purpose of background verification.",
      );

      console.log("COURT RECORD CONSENT RESPONSE:", courtRecordConsentResponse);

      if (!courtRecordConsentResponse?.success) {
        throw new Error(
          courtRecordConsentResponse?.message ||
            "Failed to save Court Record consent.",
        );
      }
      // =====================================================
      // SAVE BANK STATEMENT CONSENT
      // =====================================================

      if (hasBankStatement) {
        setSavingBankStatementConsent(true);

        const bankStatementConsentResponse = await saveCandidateConsent(
          candidate.id,
          candidate.bgv_id,
          "BANK_STATEMENT_ANALYZER",
          "I give my consent to access, process, and analyze my bank statement for the purpose of background verification.",
        );

        console.log(
          "BANK STATEMENT CONSENT RESPONSE:",
          bankStatementConsentResponse,
        );

        if (!bankStatementConsentResponse?.success) {
          throw new Error(
            bankStatementConsentResponse?.message ||
              "Failed to save Bank Statement consent.",
          );
        }
      }
      // =====================================================
      // SUBMIT DOCUMENTS
      // =====================================================

      const response = await submitCandidateDocuments(candidate.id);

      console.log("SUBMIT DOCUMENTS RESPONSE:", response);

      if (response?.status === "success") {
        await updateCandidateStatusApi(candidate.candidate_id, {
          status: "DOCUMENTS_UPLOADED",
          progress: 40,
        });

        setSuccess(true);
      }
    } catch (error) {
      console.error("Document submission / Employment consent failed:", error);

      alert(
        error instanceof Error ? error.message : "Document submission failed.",
      );
    } finally {
      setSavingEmploymentConsent(false);
      setSavingCreditBureauConsent(false);
      setSavingCourtRecordConsent(false);
      setSavingBankStatementConsent(false);
      setSavingBankDetails(false);
      setIsUploading(false);
    }
  };

  if (alreadyUploaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold">Documents Already Submitted</h1>
          <p className="text-gray-500 mt-3">
            You have already uploaded your documents successfully.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-gray-100">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900">
            Upload Successful
          </h1>
          <p className="text-gray-600 mt-4">
            Thank you, {candidate?.full_name || "Candidate"}. Your documents
            have been submitted for verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={activeDoc === "Selfie" ? "image/*" : ".pdf,.jpg,.jpeg,.png"}
        capture={activeDoc === "Selfie" ? "user" : undefined}
      />

      <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
        {/* Aadhaar Consent Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg">Aadhaar Verification</h3>

          <p className="text-sm text-gray-500 mt-2">
            Complete your Aadhaar verification securely.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                aadhaarStatus === "SUCCESS"
                  ? "bg-green-100 text-green-700"
                  : aadhaarStatus === "INITIALIZING" ||
                      aadhaarStatus === "VERIFYING"
                    ? "bg-yellow-100 text-yellow-700"
                    : aadhaarStatus === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
              }`}
            >
              {aadhaarStatus === "SUCCESS"
                ? "Completed"
                : aadhaarStatus === "INITIALIZING"
                  ? "Initializing..."
                  : aadhaarStatus === "VERIFYING"
                    ? "Verifying..."
                    : aadhaarStatus === "REJECTED"
                      ? "Verification Failed"
                      : "Not Started"}
            </span>

            <button
              onClick={handleConsent}
              disabled={
                loadingConsent || !isSdkLoaded || aadhaarStatus === "SUCCESS"
              }
              className="bg-[#5B5FEF] text-white px-5 py-2 rounded-xl font-medium hover:bg-[#4B4FD8] disabled:bg-gray-400"
            >
              {aadhaarStatus === "SUCCESS"
                ? "Completed"
                : loadingConsent
                  ? "Processing..."
                  : "Start Verification"}
            </button>
          </div>

          <div id="sdk-mount-point" className="mt-6 min-h-[500px]"></div>
        </div>

        {/* Candidate Info Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Verification Portal
          </h1>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Name</p>
              <p className="font-semibold text-gray-800">
                {candidate?.full_name || "Loading..."}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
              <p className="font-semibold text-gray-800">
                {candidate?.email || "Loading..."}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Checklist */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-lg mb-4">Required Documents</h3>
          {docTypes.map((doc) => {
            const isMulti = doc === "Salary Slip";

            // =====================================================
            // PASSPORT FRONT + BACK
            // =====================================================

            if (doc === "Passport") {
              const passportFront = uploadedFiles["Passport Front"];
              const passportBack = uploadedFiles["Passport Back"];

              const hasFront = !!passportFront;
              const hasBack = !!passportBack;

              return (
                <div
                  key={doc}
                  className="flex flex-col p-4 border rounded-2xl bg-gray-50/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText
                      className={
                        hasFront && hasBack
                          ? "text-green-500"
                          : "text-indigo-500"
                      }
                    />

                    <div>
                      <span className="font-semibold block">Passport</span>

                      <p className="text-xs text-gray-500 mt-1">
                        Upload both front and back pages
                      </p>
                    </div>
                  </div>

                  {/* =================================================
            PASSPORT FRONT
        ================================================= */}

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border mb-3">
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold">Passport Front</p>

                      {hasFront && (
                        <p className="text-xs text-green-600 truncate max-w-[220px]">
                          {passportFront.file_name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => triggerUpload("Passport Front")}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        {hasFront ? "Replace" : "Upload"}
                      </button>

                      {hasFront && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* =================================================
            PASSPORT BACK
        ================================================= */}

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border">
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold">Passport Back</p>

                      {hasBack && (
                        <p className="text-xs text-green-600 truncate max-w-[220px]">
                          {passportBack.file_name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => triggerUpload("Passport Back")}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        {hasBack ? "Replace" : "Upload"}
                      </button>

                      {hasBack && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            }
            // =====================================================
            // DRIVING LICENSE FRONT + BACK
            // =====================================================

            if (doc === "Driving License") {
              const drivingLicenseFront =
                uploadedFiles["Driving License Front"];

              const drivingLicenseBack = uploadedFiles["Driving License Back"];

              const hasFront = !!drivingLicenseFront;
              const hasBack = !!drivingLicenseBack;

              return (
                <div
                  key={doc}
                  className="flex flex-col p-4 border rounded-2xl bg-gray-50/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText
                      className={
                        hasFront && hasBack
                          ? "text-green-500"
                          : "text-indigo-500"
                      }
                    />

                    <div>
                      <span className="font-semibold block">
                        Driving License
                      </span>

                      <p className="text-xs text-gray-500 mt-1">
                        Upload both front and back sides
                      </p>
                    </div>
                  </div>

                  {/* =================================================
          DRIVING LICENSE FRONT
      ================================================= */}

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border mb-3">
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold">
                        Driving License Front
                      </p>

                      {hasFront && (
                        <p className="text-xs text-green-600 truncate max-w-[220px]">
                          {drivingLicenseFront.file_name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => triggerUpload("Driving License Front")}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        {hasFront ? "Replace" : "Upload"}
                      </button>

                      {hasFront && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* =================================================
          DRIVING LICENSE BACK
      ================================================= */}

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border">
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold">
                        Driving License Back
                      </p>

                      {hasBack && (
                        <p className="text-xs text-green-600 truncate max-w-[220px]">
                          {drivingLicenseBack.file_name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => triggerUpload("Driving License Back")}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        {hasBack ? "Replace" : "Upload"}
                      </button>

                      {hasBack && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            }
            // =====================================================
            // BANK STATEMENT
            // =====================================================

            if (doc === "Bank Statement") {
              const bankStatement = uploadedFiles["Bank Statement"];
              const hasBankStatement = !!bankStatement;

              return (
                <div
                  key={doc}
                  className="flex flex-col p-4 border rounded-2xl bg-gray-50/50"
                >
                  {/* Bank Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Name
                    </label>

                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Enter bank name"
                      disabled={isUploading || savingBankDetails}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#5B5FEF] focus:ring-2 focus:ring-[#5B5FEF]/20"
                    />
                  </div>

                  {/* Bank Statement Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Statement Password
                    </label>

                    <input
                      type="password"
                      value={bankStatementPassword}
                      onChange={(e) => setBankStatementPassword(e.target.value)}
                      placeholder="Enter statement password"
                      disabled={isUploading || savingBankDetails}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#5B5FEF] focus:ring-2 focus:ring-[#5B5FEF]/20"
                    />
                  </div>

                  {/* Upload Bank Statement */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText
                        className={
                          hasBankStatement
                            ? "text-green-500"
                            : "text-indigo-500"
                        }
                      />

                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold">
                          Upload Bank Statement
                        </p>

                        {hasBankStatement && (
                          <p className="text-xs text-green-600 truncate max-w-[220px]">
                            {bankStatement.file_name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => triggerUpload("Bank Statement")}
                        disabled={isUploading}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 disabled:text-gray-400"
                      >
                        {hasBankStatement ? "Replace" : "Upload"}
                      </button>

                      {hasBankStatement && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            }
            // =====================================================
            // EXISTING DOCUMENTS
            // =====================================================

            const files = uploadedFiles[doc];
            const hasFiles = Array.isArray(files) ? files.length > 0 : !!files;

            return (
              <div
                key={doc}
                className="flex flex-col p-4 border rounded-2xl bg-gray-50/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText
                      className={`flex-shrink-0 ${
                        hasFiles ? "text-green-500" : "text-indigo-500"
                      }`}
                    />

                    <div className="overflow-hidden">
                      <span className="font-semibold block">{doc}</span>

                      {!isMulti && hasFiles && (
                        <p className="text-xs text-green-600 truncate max-w-[200px]">
                          {files.file_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    {hasFiles && !isMulti ? (
                      <button
                        onClick={() => triggerUpload(doc)}
                        className="text-xs font-bold text-red-500 hover:text-red-700"
                      >
                        Replace
                      </button>
                    ) : (
                      <button
                        onClick={() => triggerUpload(doc)}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        {hasFiles && isMulti ? "Add More" : "Upload"}
                      </button>
                    )}

                    {hasFiles && !isMulti && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </div>

                {isMulti && Array.isArray(files) && files.length > 0 && (
                  <div className="mt-3 pl-8 space-y-2 border-t border-gray-200 pt-3">
                    {files.map((file: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white p-2 px-3 rounded-lg border border-gray-100 text-sm shadow-sm"
                      >
                        <span className="text-green-600 font-medium truncate max-w-[200px]">
                          {file.file_name}
                        </span>

                        <button
                          onClick={() => removeFile(doc, idx)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {/* =====================================================
              EMPLOYMENT VERIFICATION CONSENT
          ===================================================== */}

          <div className="mt-6 p-4 border border-gray-200 rounded-2xl bg-gray-50">
            <div className="flex items-start gap-3">
              <input
                id="employment-consent"
                type="checkbox"
                checked={employmentConsent}
                onChange={(e) => setEmploymentConsent(e.target.checked)}
                disabled={isUploading || savingEmploymentConsent}
                className="mt-1 w-5 h-5 accent-[#5B5FEF] cursor-pointer"
              />

              <label
                htmlFor="employment-consent"
                className="text-sm text-gray-700 leading-6 cursor-pointer"
              >
                I give my consent to verify my employment history and employment
                records for the purpose of background verification.
              </label>
            </div>
          </div>
          {/* =====================================================
    CREDIT BUREAU VERIFICATION CONSENT
===================================================== */}

          <div className="mt-4 p-4 border border-gray-200 rounded-2xl bg-gray-50">
            <div className="flex items-start gap-3">
              <input
                id="credit-bureau-consent"
                type="checkbox"
                checked={creditBureauConsent}
                onChange={(e) => setCreditBureauConsent(e.target.checked)}
                disabled={isUploading || savingCreditBureauConsent}
                className="mt-1 w-5 h-5 accent-[#5B5FEF] cursor-pointer"
              />

              <label
                htmlFor="credit-bureau-consent"
                className="text-sm text-gray-700 leading-6 cursor-pointer"
              >
                I give my consent to obtain, access, and verify my credit
                information and credit bureau records for the purpose of
                background verification.
              </label>
            </div>
          </div>
          {/* =====================================================
    COURT RECORD VERIFICATION CONSENT
===================================================== */}

          <div className="mt-4 p-4 border border-gray-200 rounded-2xl bg-gray-50">
            <div className="flex items-start gap-3">
              <input
                id="court-record-consent"
                type="checkbox"
                checked={courtRecordConsent}
                onChange={(e) => setCourtRecordConsent(e.target.checked)}
                disabled={isUploading || savingCourtRecordConsent}
                className="mt-1 w-5 h-5 accent-[#5B5FEF] cursor-pointer"
              />

              <label
                htmlFor="court-record-consent"
                className="text-sm text-gray-700 leading-6 cursor-pointer"
              >
                I give my consent to search, access, and verify court and
                criminal record information for the purpose of background
                verification.
              </label>
            </div>
          </div>
          {/* =====================================================
    BANK STATEMENT VERIFICATION CONSENT
===================================================== */}

          <div className="mt-4 p-4 border border-gray-200 rounded-2xl bg-gray-50">
            <div className="flex items-start gap-3">
              <input
                id="bank-statement-consent"
                type="checkbox"
                checked={bankStatementConsent}
                onChange={(e) => setBankStatementConsent(e.target.checked)}
                disabled={isUploading || savingBankStatementConsent}
                className="mt-1 w-5 h-5 accent-[#5B5FEF] cursor-pointer"
              />

              <label
                htmlFor="bank-statement-consent"
                className="text-sm text-gray-700 leading-6 cursor-pointer"
              >
                I give my consent to access, process, and analyze my bank
                statement for the purpose of background verification.
              </label>
            </div>
          </div>
          <button
            onClick={submitAll}
            disabled={isUploading}
            className="w-full bg-[#5B5FEF] text-white py-4 rounded-2xl font-bold mt-6 hover:bg-[#4B4FD8] transition-all flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Submit Documents"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidatePortal;
