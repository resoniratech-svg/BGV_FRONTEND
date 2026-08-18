import axios from "../../api/axios";
import VerificationModuleCard from "../../components/verification/VerificationModuleCard";
import VerificationResultModal from "../../components/verification/VerificationResultModal";
import VerificationCard from "../../components/verification/VerificationCard";
import { verificationModules } from "../../types/verificationModules";
import { executeVerification } from "../../services/verificationExecutor";
import WatchlistResultView from "../../components/verification/WatchlistResultView";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { processOCRDocument } from "../../api/ocrApi";
import ResumeVerificationCard from "../../components/verification/ResumeVerificationCard";
import { verifyPAN, getPANResult, savePANDecision } from "../../api/panApi";
import DeepfakeVerificationCard from "../../components/verification/DeepfakeVerificationCard";
import {
  screenWatchlist,
  updateWatchlistDecision,
} from "../../api/watchlistApi";
import { useState, useEffect } from "react";
import { parseResume, updateResumeDecision } from "../../api/resumeApi";
import DeepfakeResultView from "../../components/verification/DeepfakeResultView";
import EmploymentResultView from "../../components/verification/EmploymentResultView";
import {
  getCandidateById,
  getCandidateDocuments,
} from "../../api/candidateApi";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Candidate } from "../../types/Candidate";
import SalarySlipResultView from "../../components/verification/SalarySlipResultView";
import PANResultView from "../../components/verification/PANResultView";
import {
  verifyDeepfake,
  getDeepfakeResult,
  saveDeepfakeDecision,
} from "../../api/deepfakeApi";
import {
  verifyPassport,
  getPassportResult,
  savePassportDecision,
} from "../../api/passportApi";
import {
  verifyDrivingLicense,
  getDrivingLicenseResult,
  saveDrivingLicenseDecision,
} from "../../api/drivingLicenseApi";
import PassportResultView from "../../components/verification/PassportResultView";
import DrivingLicenseResultView from "../../components/verification/DrivingLicenseResultView";
import {
  verifySalarySlip,
  updateSalarySlipDecision,
  getSalarySlipResult,
} from "../../api/salarySlipApi";
import {
  verifyEmployment,
  getEmploymentResult,
  saveEmploymentDecision,
} from "../../api/employmentApi";
import {
  verifyCreditBureau,
  getCreditBureauResult,
  saveCreditBureauDecision,
} from "../../api/creditBureauApi";
import CreditBureauResultView from "../../components/verification/CreditBureauResultView";

import {
  verifyCourtRecord,
  getCourtRecordResult,
  saveCourtRecordDecision,
} from "../../api/courtRecordApi";
import {
  verifyBankStatement,
  getBankStatementResult,
  saveBankStatementDecision,
} from "../../api/bankStatementApi";
import BankStatementResultView from "../../components/verification/BankStatementResultView";
// import CreditBureauResultView from "../../components/verification/CreditBureauResultView";
import CourtRecordResultView from "../../components/verification/CourtRecordResultView";
import SalarySlipVerificationCard from "../../components/verification/SalarySlipVerificationCard";

import PANVerificationCard from "../../components/verification/PANVerificationCard";
import {
  verifyFaceMatch,
  getFaceMatchResult,
  saveFaceMatchDecision,
} from "../../api/faceMatchApi";
import { getAadhaarResult, saveAadhaarDecision } from "../../api/aadhaarApi";
import AadhaarResultView from "../../components/verification/AadhaarResultView";

import FaceMatchResultView from "../../components/verification/FaceMatchResultView";
const API_URL = import.meta.env.VITE_API_URL;

type VerificationStatus =
  | "Verified"
  | "Not Verified"
  | "Fraud"
  | "Rejected"
  | "Unknown";

function CandidateVerificationCenter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [passportResult, setPassportResult] = useState<any>(null);
  const [showPassportResult, setShowPassportResult] = useState(false);
  const [passportStatus, setPassportStatus] = useState("");
  const [aadhaarResult, setAadhaarResult] = useState<any>(null);
  const [showAadhaarResult, setShowAadhaarResult] = useState(false);
  const [aadhaarMatchStatus, setAadhaarMatchStatus] = useState("");
  const [aadhaarDocument, setAadhaarDocument] = useState<any>(null);
  const [drivingLicenseResult, setDrivingLicenseResult] = useState<any>(null);
  const [showDrivingLicenseResult, setShowDrivingLicenseResult] =
    useState(false);
  const [drivingLicenseMatchStatus, setDrivingLicenseMatchStatus] =
    useState("");
  const [bankStatementResult, setBankStatementResult] = useState<any>(null);
  const [showBankStatementResult, setShowBankStatementResult] = useState(false);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [riskLevels, setRiskLevels] = useState<Record<string, string>>({});
  const [decisionStatus, setDecisionStatus] = useState<Record<string, string>>(
    {},
  );
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});
  const [moduleStatuses, setModuleStatuses] = useState<
    Record<string, VerificationStatus | null>
  >({});
  const [watchlistResult, setWatchlistResult] = useState<any>(null);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const [showOCRDocumentSelector, setShowOCRDocumentSelector] = useState(false);
  const [showOCRResult, setShowOCRResult] = useState(false);
  const [salarySlipResult, setSalarySlipResult] = useState<any>(null);
  const [employmentResult, setEmploymentResult] = useState<any>(null);
  const [creditBureauResult, setCreditBureauResult] = useState<any>(null);
  const [showCreditBureauResult, setShowCreditBureauResult] = useState(false);
  const [showEmploymentResult, setShowEmploymentResult] = useState(false);
  const [courtRecordResult, setCourtRecordResult] = useState<any>(null);
  const [showCourtRecordResult, setShowCourtRecordResult] = useState(false);
  const [panResult, setPanResult] = useState<any>(null);
  const [showPanResult, setShowPanResult] = useState(false);
  const [faceMatchResult, setFaceMatchResult] = useState<any>(null);

  const [showFaceMatchResult, setShowFaceMatchResult] = useState(false);
  const [faceMatchSelfieUrl, setFaceMatchSelfieUrl] = useState("");
  const [faceMatchAadhaarUrl, setFaceMatchAadhaarUrl] = useState("");
  const [faceMatchRisk, setFaceMatchRisk] = useState("LOW");
  const [faceMatchStatus, setFaceMatchStatus] = useState("");
  // FIX 1: Default to empty string instead of "Match"
  const [panMatchStatus, setPanMatchStatus] = useState("");
  const [deepfakeResult, setDeepfakeResult] = useState<any>(null);

  const [showDeepfakeResult, setShowDeepfakeResult] = useState(false);

  const [deepfakeRisk, setDeepfakeRisk] = useState("");

  const [showSalarySlipResult, setShowSalarySlipResult] = useState(false);
  const [salarySlipRisk] = useState("LOW");
  const [salarySlipDecision, setSalarySlipDecision] = useState("Verified");
  const [ocrDocuments, setOcrDocuments] = useState<any[]>([]);
  const [resumeDocumentId, setResumeDocumentId] = useState<number | null>(null);

  const [showResumeViewer, setShowResumeViewer] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const loadFaceMatchImages = async () => {
    try {
      const docsResponse = await getCandidateDocuments(Number(id));

      const documents = docsResponse?.data || docsResponse || [];

      const selfie = documents.find(
        (doc: any) =>
          String(doc.document_type || "")
            .trim()
            .toLowerCase() === "selfie",
      );

      const aadhaar = documents.find(
        (doc: any) =>
          String(doc.document_type || "")
            .trim()
            .toLowerCase() === "aadhaar",
      );

      if (!selfie) {
        console.warn("Face Match: Selfie document not found");
      }

      if (!aadhaar) {
        console.warn("Face Match: Aadhaar document not found");
      }

      /*
       * Your existing document viewer endpoint is:
       *
       * /documents/{document_id}/view
       *
       * We fetch it through axios so the existing JWT/authentication
       * configuration is preserved.
       */

      if (selfie) {
        const response = await axios.get(`/documents/${selfie.id}/view`, {
          responseType: "blob",
        });

        const url = URL.createObjectURL(response.data);

        setFaceMatchSelfieUrl((oldUrl) => {
          if (oldUrl) {
            URL.revokeObjectURL(oldUrl);
          }

          return url;
        });
      }

      if (aadhaar) {
        const response = await axios.get(`/documents/${aadhaar.id}/view`, {
          responseType: "blob",
        });

        const url = URL.createObjectURL(response.data);

        setFaceMatchAadhaarUrl((oldUrl) => {
          if (oldUrl) {
            URL.revokeObjectURL(oldUrl);
          }

          return url;
        });
      }
    } catch (error) {
      console.error("Failed to load Face Match images:", error);
    }
  };
  const groupedDocuments = ocrDocuments.reduce((acc: any, doc: any) => {
    if (!acc[doc.document_type]) {
      acc[doc.document_type] = [];
    }
    acc[doc.document_type].push(doc);
    return acc;
  }, {});

  useEffect(() => {
    const loadPage = async () => {
      await loadCandidate();
      await restoreAadhaarResult();
      await restoreDrivingLicenseResult();
    };

    loadPage();
  }, [id]);
  // =====================================================
  // RESTORE SAVED AADHAAR RESULT
  // =====================================================

  const restoreAadhaarResult = async () => {
    if (!id) return;

    try {
      console.log("========== RESTORING AADHAAR RESULT ==========");

      const result = await getAadhaarResult(Number(id));

      console.log("SAVED AADHAAR RESULT:", result);

      if (!result) {
        console.log("No saved Aadhaar result found");
        return;
      }

      setAadhaarResult(result);

      // =====================================================
      // NORMALIZE RESPONSE
      // =====================================================

      const resultData = result?.data?.data ?? result?.data ?? result ?? {};

      console.log("NORMALIZED AADHAAR DATA:", resultData);

      // =====================================================
      // EXTRACT VERIFICATION STATUS
      // =====================================================

      const verificationStatus =
        resultData?.verification_status ??
        result?.data?.verification_status ??
        result?.verification_status ??
        "";

      const normalizedStatus = String(verificationStatus).trim().toUpperCase();

      console.log("AADHAAR VERIFICATION STATUS:", normalizedStatus);

      // =====================================================
      // EXTRACT MATCH STATUS
      // =====================================================

      const nameMatchStatus =
        resultData?.name_match_status ?? result?.data?.name_match_status ?? "";

      const dobMatchStatus =
        resultData?.dob_match_status ?? result?.data?.dob_match_status ?? "";

      const isAadhaarMatch =
        String(nameMatchStatus).trim().toUpperCase() === "MATCH" &&
        String(dobMatchStatus).trim().toUpperCase() === "MATCH";

      setAadhaarMatchStatus(isAadhaarMatch ? "MATCH" : "NOT MATCH");

      console.log("AADHAAR MATCH:", {
        nameMatchStatus,
        dobMatchStatus,
        final: isAadhaarMatch ? "MATCH" : "NOT MATCH",
      });

      console.log("========== AADHAAR RESTORED ==========");
    } catch (error) {
      console.error("FAILED TO RESTORE AADHAAR RESULT:", error);
    }
  };
  // =====================================================
  // RESTORE SAVED DRIVING LICENSE RESULT
  // =====================================================

  const restoreDrivingLicenseResult = async () => {
    if (!id) return;

    // Do not request a Driving License result when
    // Driving License verification has never been performed.
    const dlStatus =
      candidate?.verification_summary?.dl_status ??
      candidate?.verification_summary?.driving_license_status ??
      "";

    if (!dlStatus) {
      console.log(
        "DRIVING LICENSE RESULT: No verification status found. Skipping result API.",
      );

      setDrivingLicenseMatchStatus("");

      return;
    }

    try {
      console.log("========== RESTORING DRIVING LICENSE ==========");

      const result = await getDrivingLicenseResult(Number(id));

      console.log("RAW DRIVING LICENSE RESULT:", result);

      if (!result) {
        console.log("No saved Driving License result found");
        return;
      }

      setDrivingLicenseResult(result);

      // =====================================================
      // NORMALIZE RESPONSE
      // =====================================================

      const resultData = result?.data?.data ?? result?.data ?? result ?? {};

      console.log("NORMALIZED DRIVING LICENSE DATA:", resultData);

      // =====================================================
      // FIND COMPARISON
      // =====================================================

      const comparison =
        resultData?.comparison ??
        resultData?.verification?.comparison ??
        resultData?.data?.comparison ??
        resultData?.verification ??
        {};

      console.log("DRIVING LICENSE COMPARISON:", comparison);

      // =====================================================
      // MATCH VALUES
      // =====================================================

      const dlMatch =
        comparison?.driving_license_number ??
        comparison?.dl_number ??
        resultData?.dl_number_match_status ??
        resultData?.data?.dl_number_match_status ??
        "";

      const nameMatch =
        comparison?.name ??
        resultData?.name_match_status ??
        resultData?.data?.name_match_status ??
        "";

      const dobMatch =
        comparison?.date_of_birth ??
        comparison?.dob ??
        resultData?.dob_match_status ??
        resultData?.data?.dob_match_status ??
        "";

      const addressMatch =
        comparison?.address ??
        resultData?.address_match_status ??
        resultData?.data?.address_match_status ??
        "";

      console.log("DRIVING LICENSE MATCH VALUES:", {
        dlMatch,
        nameMatch,
        dobMatch,
        addressMatch,
      });

      // =====================================================
      // FINAL MATCH
      // =====================================================

      const isDrivingLicenseMatch =
        String(dlMatch).trim().toUpperCase() === "MATCH" &&
        String(nameMatch).trim().toUpperCase() === "MATCH" &&
        String(dobMatch).trim().toUpperCase() === "MATCH" &&
        String(addressMatch).trim().toUpperCase() === "MATCH";

      console.log(
        "FINAL DRIVING LICENSE MATCH:",
        isDrivingLicenseMatch ? "MATCH" : "NOT MATCH",
      );

      setDrivingLicenseMatchStatus(
        isDrivingLicenseMatch ? "MATCH" : "NOT MATCH",
      );

      // =====================================================
      // RESTORE VERIFICATION / DECISION STATUS
      // =====================================================

      const savedVerificationStatus =
        resultData?.verification_status ??
        resultData?.verification?.verification_status ??
        result?.data?.verification_status ??
        result?.verification_status ??
        "";

      const normalizedStatus = String(savedVerificationStatus)
        .trim()
        .toUpperCase();

      console.log(
        "DRIVING LICENSE SAVED VERIFICATION STATUS:",
        normalizedStatus,
      );

      let savedDecision: VerificationStatus | "" = "";

      if (normalizedStatus === "VERIFIED" || normalizedStatus === "APPROVED") {
        savedDecision = "Verified";
      } else if (normalizedStatus === "REJECTED") {
        savedDecision = "Rejected";
      } else if (normalizedStatus === "FRAUD") {
        savedDecision = "Fraud";
      } else if (normalizedStatus === "NOT VERIFIED") {
        savedDecision = "Not Verified";
      }

      if (savedDecision) {
        setModuleStatuses((prev) => ({
          ...prev,
          "Driving License": savedDecision,
        }));

        setDecisionStatus((prev) => ({
          ...prev,
          "Driving License": savedDecision,
        }));
      }

      console.log("========== DRIVING LICENSE RESTORED ==========");
    } catch (error) {
      console.error("FAILED TO RESTORE DRIVING LICENSE RESULT:", error);
    }
  };
  // =====================================================
  // RESTORE SAVED PASSPORT RESULT ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    const restorePassportResult = async () => {
      if (!id) {
        return;
      }

      try {
        console.log("=====================================================");
        console.log("RESTORING SAVED PASSPORT RESULT");
        console.log("CANDIDATE ID:", id);
        console.log("=====================================================");

        const result = await getPassportResult(Number(id));

        console.log("SAVED PASSPORT RESULT:", result);

        if (!result) {
          console.log("No saved Passport verification result found.");

          return;
        }

        setPassportResult(result);

        const verification = result?.data?.data?.verification ?? null;

        const passportMatch = String(verification?.passport_match_status ?? "")
          .trim()
          .toUpperCase();

        const nameMatch = String(verification?.name_match_status ?? "")
          .trim()
          .toUpperCase();

        const dobMatch = String(verification?.dob_match_status ?? "")
          .trim()
          .toUpperCase();

        const isPassportMatch =
          passportMatch === "MATCH" &&
          nameMatch === "MATCH" &&
          dobMatch === "MATCH";

        console.log("PASSPORT MATCH VALUES:", {
          passportMatch,
          nameMatch,
          dobMatch,
          isPassportMatch,
        });

        setPassportStatus(isPassportMatch ? "MATCH" : "NOT MATCH");
        const savedVerificationStatus =
          result?.data?.data?.verification?.verification_status ??
          result?.data?.verification?.verification_status ??
          result?.verification?.verification_status ??
          result?.data?.verification_status ??
          result?.verification_status ??
          "";

        console.log(
          "SAVED PASSPORT VERIFICATION STATUS:",
          savedVerificationStatus,
        );

        const normalizedStatus = String(savedVerificationStatus)
          .trim()
          .toUpperCase();

        if (normalizedStatus === "VERIFIED") {
          setModuleStatuses((prev) => ({
            ...prev,
            Passport: "Verified",
          }));

          setDecisionStatus((prev) => ({
            ...prev,
            Passport: "Verified",
          }));
        } else if (normalizedStatus === "REJECTED") {
          setModuleStatuses((prev) => ({
            ...prev,
            Passport: "Rejected",
          }));

          setDecisionStatus((prev) => ({
            ...prev,
            Passport: "Rejected",
          }));
        } else if (normalizedStatus === "FRAUD") {
          setModuleStatuses((prev) => ({
            ...prev,
            Passport: "Fraud",
          }));

          setDecisionStatus((prev) => ({
            ...prev,
            Passport: "Fraud",
          }));
        }

        console.log("PASSPORT FRONTEND STATE RESTORED:", normalizedStatus);
      } catch (error) {
        console.error("Failed to restore saved Passport result:", error);
      }
    };

    restorePassportResult();
  }, [id]);

  const loadCandidate = async () => {
    try {
      const response = await getCandidateById(Number(id));
      const candidateData = response?.data || response;
      console.log("Candidate Data");
      console.log(candidateData);
      if (!candidateData) {
        console.error("Candidate not found");
        return;
      }

      setCandidate(candidateData);

      const docsResponse = await getCandidateDocuments(Number(id));
      const docs = docsResponse.data || [];
      console.log("DOCUMENTS");
      console.log(docs);
      const resumeDoc = docs.find((doc: any) => doc.document_type === "Resume");
      if (resumeDoc) {
        setResumeDocumentId(resumeDoc.id);
      }

      const summaryResponse = await axios.get(`/verification-summary/${id}`);

      const summary =
        summaryResponse?.data?.data ??
        summaryResponse?.data ??
        summaryResponse ??
        {};

      console.log("========== VERIFICATION SUMMARY ==========");
      console.log("RAW SUMMARY RESPONSE:", summaryResponse);
      console.log("NORMALIZED SUMMARY:", summary);
      console.log("EMPLOYMENT STATUS:", summary?.employment_status);
      console.log("==========================================");

      if (!summary) {
        console.warn("Verification summary not found");
        return;
      }

      // ISSUE 7 — Add logs
      console.log("SUMMARY");
      console.log(summary);
      console.log(summary.pan_status);

      // ISSUE 7 — Add logs
      console.log("SETTING MODULE");
      console.log(summary.pan_status);

      setModuleStatuses((prev) => ({
        ...prev,
        Aadhaar: summary.aadhaar_status || prev.Aadhaar || null,
        PAN: summary.pan_status || prev.PAN || null,
        Passport: summary.passport_status || prev.Passport || null,
        "Driving License": summary.dl_status || prev["Driving License"] || null,
        "Deepfake Detection":
          summary.deepfake_status || prev["Deepfake Detection"] || null,
        "Face Match": summary.face_match_status || prev["Face Match"] || null,
        "Resume Parsing":
          summary.resume_status || prev["Resume Parsing"] || null,
        "Bank Statement":
          summary.bank_statement_status ||
          summary.bank_status ||
          prev["Bank Statement"] ||
          null,
        Employment: summary.employment_status || prev.Employment || null,
        "Salary Slip":
          summary.salary_slip_status || prev["Salary Slip"] || null,
        "Credit Bureau": summary.credit_status || prev["Credit Bureau"] || null,
        "Court Record": summary.court_status || prev["Court Record"] || null,
        Watchlist: summary.watchlist_status || prev.Watchlist || null,
      }));
      // =====================================================
      // RESTORE CREDIT BUREAU RESULT
      // =====================================================

      try {
        console.log("========== LOADING SAVED CREDIT BUREAU ==========");

        const creditResult = await getCreditBureauResult(Number(id));

        console.log("SAVED CREDIT BUREAU RESULT:", creditResult);

        // =====================================================
        // CHECK WHETHER ACTUAL RESULT EXISTS
        // =====================================================

        const resultData =
          creditResult?.data?.data ?? creditResult?.data ?? creditResult ?? {};

        const creditBureauResult =
          resultData?.credit_bureau_result ?? resultData?.result ?? null;

        console.log("CREDIT BUREAU RESULT DATA:", resultData);
        console.log("CREDIT BUREAU MAIN RESULT:", creditBureauResult);

        // =====================================================
        // NO RESULT
        // =====================================================

        if (!creditBureauResult) {
          console.log(
            "CREDIT BUREAU: No detailed result found, using summary status.",
          );

          setCreditBureauResult(null);

          if (
            ["Verified", "Not Verified", "Fraud", "Rejected"].includes(
              summary.credit_status,
            )
          ) {
            setModuleStatuses((prev) => ({
              ...prev,
              "Credit Bureau": summary.credit_status as VerificationStatus,
            }));

            setDecisionStatus((prev) => ({
              ...prev,
              "Credit Bureau": summary.credit_status,
            }));
          }
        }

        // =====================================================
        // RESULT EXISTS
        // =====================================================

        setCreditBureauResult(creditResult);

        // A result exists, so the card should show:
        // View Result
        // Risk
        // Decision
        // Reverify

        setModuleStatuses((prev) => ({
          ...prev,
          "Credit Bureau": summary.credit_status || "Not Verified",
        }));

        console.log("CREDIT BUREAU RESULT EXISTS - CARD COMPLETED");

        console.log(
          "CREDIT BUREAU DECISION:",
          summary.credit_status || "No decision yet",
        );
      } catch (error) {
        console.log("CREDIT BUREAU RESULT DOES NOT EXIST.", error);

        setCreditBureauResult(null);

        setModuleStatuses((prev) => ({
          ...prev,
          "Credit Bureau": null,
        }));
      }
      // =====================================================
      // RESTORE SAVED BANK STATEMENT RESULT
      // =====================================================

      try {
        console.log("========== LOADING SAVED BANK STATEMENT ==========");

        // =====================================================
        // CHECK SUMMARY STATUS FIRST
        //
        // If Bank Statement verification was never started,
        // do NOT call the Bank Statement result API.
        // =====================================================

        const bankStatementSummaryStatus =
          summary?.bank_statement_status ?? summary?.bank_status ?? "";

        console.log(
          "BANK STATEMENT SUMMARY STATUS:",
          bankStatementSummaryStatus || "No status",
        );

        if (!bankStatementSummaryStatus) {
          console.log(
            "BANK STATEMENT: Verification has not been started. Skipping result API.",
          );

          setBankStatementResult(null);

          setModuleStatuses((prev) => ({
            ...prev,
            "Bank Statement": null,
          }));

          setDecisionStatus((prev) => ({
            ...prev,
            "Bank Statement": "",
          }));

          // Do not continue into result loading
        } else {
          // =====================================================
          // GET SAVED BANK STATEMENT RESULT
          // =====================================================

          const bankResult = await getBankStatementResult(
            Number(id),
            candidateData.bgv_id,
          );

          console.log("SAVED BANK STATEMENT RESULT:", bankResult);

          // =====================================================
          // NO SAVED RESULT
          // =====================================================

          if (!bankResult) {
            console.log(
              "BANK STATEMENT: Detailed result not found, but summary status exists:",
              bankStatementSummaryStatus,
            );

            setBankStatementResult(null);

            // IMPORTANT:
            // Do NOT reset the module status to null.
            // candidate_verification_summary is the source of truth
            // for whether this module has already been processed.

            if (
              ["Verified", "Not Verified", "Fraud", "Rejected"].includes(
                bankStatementSummaryStatus,
              )
            ) {
              setModuleStatuses((prev) => ({
                ...prev,
                "Bank Statement":
                  bankStatementSummaryStatus as VerificationStatus,
              }));

              setDecisionStatus((prev) => ({
                ...prev,
                "Bank Statement": bankStatementSummaryStatus,
              }));
            }
          } else {
            // =====================================================
            // STORE RESULT
            // =====================================================

            setBankStatementResult(bankResult);

            // =====================================================
            // GET AI / BANK STATEMENT VERIFICATION STATUS
            // =====================================================

            const savedVerificationStatus =
              bankResult?.data?.verification_status ??
              bankResult?.data?.data?.verification_status ??
              bankResult?.data?.result?.verification_status ??
              bankResult?.data?.data?.result?.verification_status ??
              bankResult?.verification_status ??
              "";

            const normalizedVerificationStatus = String(savedVerificationStatus)
              .trim()
              .toUpperCase();

            console.log(
              "BANK STATEMENT VERIFICATION STATUS:",
              normalizedVerificationStatus,
            );

            // =====================================================
            // GET SAVED REVIEWER DECISION
            //
            // This comes from candidate_verification_summary
            // =====================================================

            const savedDecision =
              summary?.bank_statement_status ?? summary?.bank_status ?? "";

            console.log(
              "BANK STATEMENT SAVED REVIEWER DECISION:",
              savedDecision || "No decision yet",
            );

            // =====================================================
            // RESTORE REVIEWER DECISION
            // =====================================================

            if (
              ["Verified", "Not Verified", "Fraud", "Rejected"].includes(
                savedDecision,
              )
            ) {
              setDecisionStatus((prev) => ({
                ...prev,
                "Bank Statement": savedDecision,
              }));

              setModuleStatuses((prev) => ({
                ...prev,
                "Bank Statement": savedDecision as VerificationStatus,
              }));
            } else {
              // =====================================================
              // NO REVIEWER DECISION YET
              //
              // But an actual Bank Statement result exists.
              // Keep the card in completed/result state.
              // =====================================================

              let cardStatus: VerificationStatus = "Not Verified";

              if (
                normalizedVerificationStatus === "VERIFIED" ||
                normalizedVerificationStatus === "COMPLETED" ||
                normalizedVerificationStatus === "CLEAR" ||
                normalizedVerificationStatus === "SUCCESS"
              ) {
                cardStatus = "Verified";
              } else if (normalizedVerificationStatus === "FRAUD") {
                cardStatus = "Fraud";
              } else if (normalizedVerificationStatus === "REJECTED") {
                cardStatus = "Rejected";
              } else if (
                normalizedVerificationStatus === "REQUESTED" ||
                normalizedVerificationStatus === "IN_PROGRESS" ||
                normalizedVerificationStatus === "PROCESSING"
              ) {
                cardStatus = "Not Verified";
              }

              setModuleStatuses((prev) => ({
                ...prev,
                "Bank Statement": cardStatus,
              }));

              setDecisionStatus((prev) => ({
                ...prev,
                "Bank Statement": "",
              }));

              console.log(
                "BANK STATEMENT RESULT EXISTS WITHOUT REVIEWER DECISION.",
              );

              console.log("BANK STATEMENT CARD STATUS:", cardStatus);
            }

            console.log("========== BANK STATEMENT RESTORED ==========");
          }
        }
      } catch (error) {
        console.error("BANK STATEMENT RESULT RESTORE ERROR:", error);

        setBankStatementResult(null);

        // IMPORTANT:
        // Keep Bank Statement in completed state if the
        // verification summary already contains a status.

        const savedBankStatus =
          summary?.bank_statement_status ?? summary?.bank_status ?? "";

        if (
          ["Verified", "Not Verified", "Fraud", "Rejected"].includes(
            savedBankStatus,
          )
        ) {
          setModuleStatuses((prev) => ({
            ...prev,
            "Bank Statement": savedBankStatus as VerificationStatus,
          }));

          setDecisionStatus((prev) => ({
            ...prev,
            "Bank Statement": savedBankStatus,
          }));
        } else if (savedBankStatus) {
          // Any non-empty provider/process status should still
          // keep the module out of "Verify Now".

          setModuleStatuses((prev) => ({
            ...prev,
            "Bank Statement": "Not Verified",
          }));

          setDecisionStatus((prev) => ({
            ...prev,
            "Bank Statement": "",
          }));
        }

        console.log(
          "BANK STATEMENT: Preserved summary status after result restore failure:",
          savedBankStatus,
        );
      }
      // =====================================================
      // RESTORE COURT RECORD RESULT
      // =====================================================

      try {
        console.log("========== LOADING SAVED COURT RECORD ==========");

        const courtResult = await getCourtRecordResult(Number(id));

        console.log("SAVED COURT RECORD RESULT:", courtResult);

        if (courtResult) {
          setCourtRecordResult(courtResult);

          // =================================================
          // GET CCRV STATUS FROM ACTUAL RESULT
          // =================================================

          const savedVerificationStatus =
            courtResult?.data?.verification_status ??
            courtResult?.data?.ccrv_status ??
            courtResult?.verification_status ??
            courtResult?.ccrv_status ??
            "";

          const normalizedStatus = String(savedVerificationStatus)
            .trim()
            .toUpperCase();

          console.log(
            "COURT RECORD SAVED VERIFICATION STATUS:",
            normalizedStatus,
          );

          let cardStatus: VerificationStatus | null = null;

          if (normalizedStatus === "VERIFIED" || normalizedStatus === "CLEAR") {
            cardStatus = "Verified";
          } else if (normalizedStatus === "FRAUD") {
            cardStatus = "Fraud";
          } else if (normalizedStatus === "REJECTED") {
            cardStatus = "Rejected";
          } else if (
            normalizedStatus === "REQUESTED" ||
            normalizedStatus === "IN_PROGRESS"
          ) {
            cardStatus = "Not Verified";
          } else if (normalizedStatus === "COMPLETED") {
            // If backend only returns ccrv_status=COMPLETED
            // and no verification_status, treat existing
            // completed result as verified for the UI.
            cardStatus = "Verified";
          }

          if (cardStatus) {
            setModuleStatuses((prev) => ({
              ...prev,
              "Court Record": cardStatus!,
            }));
          }

          // =================================================
          // RESTORE REVIEWER DECISION IF AVAILABLE
          // =================================================

          const savedDecision =
            summary?.court_status &&
            ["Verified", "Not Verified", "Fraud", "Rejected"].includes(
              summary.court_status,
            )
              ? summary.court_status
              : "";

          if (savedDecision) {
            setDecisionStatus((prev) => ({
              ...prev,
              "Court Record": savedDecision,
            }));
          }

          console.log("COURT RECORD CARD STATUS:", cardStatus);

          console.log(
            "COURT RECORD SAVED DECISION:",
            savedDecision || "No decision",
          );
        }
      } catch (error) {
        console.log("No saved Court Record result found.", error);
      }
      // =====================================================
      // PASSPORT RESULT FALLBACK
      // =====================================================
      // If passport_status is missing from candidate_verification_summary
      // but a Passport verification result already exists, restore the
      // Passport card from the saved Passport result.

      try {
        const passportResultResponse = await getPassportResult(Number(id));

        console.log("PASSPORT SAVED RESULT FALLBACK:", passportResultResponse);

        if (passportResultResponse) {
          setPassportResult(passportResultResponse);

          const passportVerificationStatus =
            passportResultResponse?.data?.data?.verification
              ?.verification_status ??
            passportResultResponse?.data?.verification?.verification_status ??
            passportResultResponse?.verification?.verification_status ??
            passportResultResponse?.data?.verification_status ??
            passportResultResponse?.verification_status ??
            "";

          console.log(
            "PASSPORT SAVED VERIFICATION STATUS:",
            passportVerificationStatus,
          );

          if (passportVerificationStatus.toUpperCase() === "VERIFIED") {
            setModuleStatuses((prev) => ({
              ...prev,
              Passport: "Verified",
            }));

            setDecisionStatus((prev) => ({
              ...prev,
              Passport: "Verified",
            }));
          } else if (passportVerificationStatus.toUpperCase() === "REJECTED") {
            setModuleStatuses((prev) => ({
              ...prev,
              Passport: "Rejected",
            }));

            setDecisionStatus((prev) => ({
              ...prev,
              Passport: "Rejected",
            }));
          } else if (passportVerificationStatus.toUpperCase() === "FRAUD") {
            setModuleStatuses((prev) => ({
              ...prev,
              Passport: "Fraud",
            }));

            setDecisionStatus((prev) => ({
              ...prev,
              Passport: "Fraud",
            }));
          }
        }
      } catch (error) {
        console.error("Failed loading saved Passport result fallback:", error);
      }
      // ISSUE 7 — Add logs
      console.log("SETTING DECISION");
      console.log(summary.pan_status);

      setDecisionStatus({
        Passport: ["Verified", "Not Verified", "Fraud", "Rejected"].includes(
          summary.passport_status,
        )
          ? summary.passport_status
          : "",
        // =====================================================
        // AADHAAR
        // =====================================================
        Aadhaar: ["Verified", "Not Verified", "Fraud", "Rejected"].includes(
          summary.aadhaar_status,
        )
          ? summary.aadhaar_status
          : "",

        // =====================================================
        // PAN
        // =====================================================
        PAN: ["Verified", "Not Verified", "Fraud", "Rejected"].includes(
          summary.pan_status,
        )
          ? summary.pan_status
          : "",

        // =====================================================
        // FACE MATCH
        // =====================================================
        "Face Match": [
          "Verified",
          "Not Verified",
          "Fraud",
          "Rejected",
        ].includes(summary.face_match_status)
          ? summary.face_match_status
          : "",

        // =====================================================
        // WATCHLIST
        // =====================================================
        Watchlist: ["Verified", "Not Verified", "Fraud", "Rejected"].includes(
          summary.watchlist_status,
        )
          ? summary.watchlist_status
          : "",

        // =====================================================
        // SALARY SLIP
        // =====================================================
        "Salary Slip": [
          "Verified",
          "Not Verified",
          "Fraud",
          "Rejected",
        ].includes(summary.salary_slip_status)
          ? summary.salary_slip_status
          : "",
        // =====================================================
        // EMPLOYMENT
        // =====================================================

        Employment: ["Verified", "Not Verified", "Fraud", "Rejected"].includes(
          summary.employment_status,
        )
          ? summary.employment_status
          : "",
        // =====================================================
        // BANK STATEMENT
        // =====================================================

        "Bank Statement": [
          "Verified",
          "Not Verified",
          "Fraud",
          "Rejected",
        ].includes(summary.bank_statement_status || summary.bank_status)
          ? summary.bank_statement_status || summary.bank_status
          : "",
        // =====================================================
        // CREDIT BUREAU
        // =====================================================
        "Credit Bureau": [
          "Verified",
          "Not Verified",
          "Fraud",
          "Rejected",
        ].includes(summary.credit_status)
          ? summary.credit_status
          : "",
        // =====================================================
        // COURT RECORD
        // =====================================================
        "Court Record": [
          "Verified",
          "Not Verified",
          "Fraud",
          "Rejected",
        ].includes(summary.court_status)
          ? summary.court_status
          : "",
        // =====================================================
        // RESUME
        // =====================================================
        "Resume Parsing": [
          "Verified",
          "Not Verified",
          "Fraud",
          "Rejected",
        ].includes(summary.resume_status)
          ? summary.resume_status
          : "",

        // =====================================================
        // DEEPFAKE
        // =====================================================
        "Deepfake Detection": [
          "Verified",
          "Not Verified",
          "Fraud",
          "Rejected",
        ].includes(summary.deepfake_status)
          ? summary.deepfake_status
          : "",

        // =====================================================
        // DRIVING LICENSE
        // =====================================================
        "Driving License": [
          "Verified",
          "Not Verified",
          "Fraud",
          "Rejected",
        ].includes(summary.dl_status)
          ? summary.dl_status
          : "",
      });

      setRiskLevels((prev) => ({
        ...prev,
        Watchlist: summary.risk_level || prev.Watchlist || "LOW",

        "Salary Slip": summary.risk_level || prev["Salary Slip"] || "LOW",
      }));

      if (summary.watchlist_status) {
        try {
          const watchlistResponse = await axios.get(
            `/global_database/result/${id}`,
          );
          setWatchlistResult(watchlistResponse.data);
        } catch (error) {
          console.error("Failed loading watchlist result", error);
        }
      }

      if (summary.pan_status) {
        try {
          const result = await getPANResult(Number(id));

          // FIX 2: Store total response object instead of result.data
          setPanResult(result);

          // FIX 3: Object navigation pathway fixed
          const verification = result?.data?.verification_result;

          // FIX 4: Better evaluation approach
          const isMatched =
            verification?.pan_match_status === "MATCH" &&
            verification?.name_match_status === "MATCH" &&
            verification?.dob_match_status === "MATCH";

          setPanMatchStatus(isMatched ? "Match" : "Mismatch");
        } catch (error) {
          console.log(error);
        }
      }
      // =====================================================
      // LOAD SAVED PASSPORT RESULT
      // =====================================================

      try {
        console.log("========== LOADING SAVED PASSPORT ==========");

        const result = await getPassportResult(Number(id));

        console.log("SAVED PASSPORT RESULT:", result);

        if (result) {
          setPassportResult(result);

          // =================================================
          // ACTUAL PASSPORT RESPONSE STRUCTURE
          //
          // result
          //   └── data
          //       └── data
          //           └── verification
          //               ├── passport_match_status
          //               ├── name_match_status
          //               └── dob_match_status
          // =================================================

          const verification = result?.data?.data?.verification ?? null;

          const passportMatchStatus = String(
            verification?.passport_match_status ?? "",
          )
            .trim()
            .toUpperCase();

          const nameMatchStatus = String(verification?.name_match_status ?? "")
            .trim()
            .toUpperCase();

          const dobMatchStatus = String(verification?.dob_match_status ?? "")
            .trim()
            .toUpperCase();

          const isPassportMatch =
            passportMatchStatus === "MATCH" &&
            nameMatchStatus === "MATCH" &&
            dobMatchStatus === "MATCH";

          setPassportStatus(isPassportMatch ? "MATCH" : "NOT MATCH");

          console.log("PASSPORT MATCH RESULT:", {
            passportMatchStatus,
            nameMatchStatus,
            dobMatchStatus,
            final: isPassportMatch ? "MATCH" : "NOT MATCH",
          });

          // =================================================
          // RESTORE DECISION FROM DATABASE
          // =================================================

          const savedDecision = String(
            result?.data?.verification_status ??
              result?.verification_status ??
              "",
          )
            .trim()
            .toUpperCase();

          console.log("SAVED PASSPORT DECISION:", savedDecision);

          if (savedDecision === "VERIFIED") {
            setModuleStatuses((prev) => ({
              ...prev,
              Passport: "Verified",
            }));

            setDecisionStatus((prev) => ({
              ...prev,
              Passport: "Verified",
            }));
          } else if (savedDecision === "REJECTED") {
            setModuleStatuses((prev) => ({
              ...prev,
              Passport: "Rejected",
            }));

            setDecisionStatus((prev) => ({
              ...prev,
              Passport: "Rejected",
            }));
          } else if (savedDecision === "FRAUD") {
            setModuleStatuses((prev) => ({
              ...prev,
              Passport: "Fraud",
            }));

            setDecisionStatus((prev) => ({
              ...prev,
              Passport: "Fraud",
            }));
          } else if (savedDecision === "NOT VERIFIED") {
            setModuleStatuses((prev) => ({
              ...prev,
              Passport: "Not Verified",
            }));

            setDecisionStatus((prev) => ({
              ...prev,
              Passport: "Not Verified",
            }));
          }
        }
      } catch (error) {
        console.error("Failed loading saved Passport result:", error);
      }
      if (summary.face_match_status) {
        try {
          const result = await getFaceMatchResult(Number(id));

          setFaceMatchResult(result);

          const status =
            result?.data?.verification_status ??
            result?.data?.data?.verification_status ??
            "";

          setFaceMatchStatus(status);

          const confidence =
            result?.data?.confidence_score ??
            result?.data?.data?.confidence_score ??
            0;

          setFaceMatchRisk(confidence >= 0.7 ? "LOW" : "HIGH");
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error: any) {
      console.error("Failed loading candidate:", error);
    }
  };

  const modules = [
    {
      title: "Identity",
      items: ["Aadhaar", "PAN", "Passport", "Driving License", "Face Match"],
    },
    {
      title: "AI/OCR",
      items: ["OCR Verification", "Deepfake Detection", "Resume Parsing"],
    },
    {
      title: "Background",
      items: [
        "Bank Statement",
        "Employment",
        "Salary Slip",
        "Credit Bureau",
        "Court Record",
        "Watchlist",
      ],
    },
  ];

  const callVerificationAPI = async (
    _moduleName: string,
  ): Promise<VerificationStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Verified");
      }, 1500);
    });
  };

  const handleVerify = async (moduleName: string) => {
    setVerifying((prev) => ({
      ...prev,
      [moduleName]: true,
    }));

    try {
      let resultStatus: VerificationStatus = "Verified";

      if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "resume"
      ) {
        const response = await parseResume(Number(id));

        if (response.status === "error") {
          alert(response.message || "Resume parsing failed");
          return;
        }

        resultStatus = "Verified";
        setDecisionStatus((prev) => ({
          ...prev,
          "Resume Parsing": "Verified",
        }));
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "ocr"
      ) {
        const docsResponse = await getCandidateDocuments(Number(id));
        const docs = docsResponse.data || [];
        setOcrDocuments(docs);
        setShowOCRDocumentSelector(true);
        return;
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "watchlist"
      ) {
        try {
          // =====================================================
          // WATCHLIST / AML SCREENING
          // =====================================================

          console.log("=====================================================");
          console.log("WATCHLIST VERIFICATION");
          console.log("=====================================================");
          console.log("Candidate ID:", Number(id));
          console.log("Candidate Name:", candidate.full_name);
          console.log("Candidate DOB:", candidate.dob);
          console.log("Candidate Gender:", candidate.gender);
          console.log("=====================================================");

          // =====================================================
          // STEP 1 — START WATCHLIST SCREENING
          // =====================================================

          const response = await screenWatchlist(Number(id));

          console.log("WATCHLIST SCREEN RESPONSE:", response);

          // =====================================================
          // HANDLE API FAILURE
          // =====================================================

          if (response?.success === false || response?.status === "error") {
            alert(response?.message || "Watchlist screening failed.");

            return;
          }

          // =====================================================
          // STEP 2 — GET SAVED WATCHLIST RESULT
          // =====================================================

          const resultResponse = await axios.get(
            `/global_database/result/${id}`,
          );

          console.log("WATCHLIST RESULT RESPONSE:", resultResponse.data);

          const watchlistData =
            resultResponse?.data?.data ??
            resultResponse?.data ??
            resultResponse ??
            {};

          // =====================================================
          // STEP 3 — STORE RESULT
          // =====================================================

          setWatchlistResult(watchlistData);

          // =====================================================
          // STEP 4 — GET RISK LEVEL
          // =====================================================

          const riskLevel = String(
            watchlistData?.risk_level ?? response?.risk_level ?? "LOW",
          )
            .trim()
            .toUpperCase();

          setRiskLevels((prev) => ({
            ...prev,
            Watchlist: riskLevel,
          }));

          // =====================================================
          // STEP 5 — DETERMINE CARD STATUS
          //
          // Screening itself is completed, but reviewer still
          // needs to make the final decision.
          // =====================================================

          resultStatus = riskLevel === "HIGH" ? "Not Verified" : "Not Verified";

          setModuleStatuses((prev) => ({
            ...prev,
            Watchlist: resultStatus,
          }));

          // Do not automatically set the reviewer decision.
          setDecisionStatus((prev) => ({
            ...prev,
            Watchlist: "",
          }));

          // =====================================================
          // STEP 6 — OPEN RESULT
          // =====================================================

          setShowWatchlistModal(true);

          console.log("=====================================================");
          console.log("WATCHLIST SCREENING COMPLETED");
          console.log("RISK LEVEL:", riskLevel);
          console.log("=====================================================");
        } catch (error: any) {
          console.error("WATCHLIST VERIFICATION ERROR:", error);

          alert(
            error?.response?.data?.message ||
              error?.message ||
              "Watchlist screening failed.",
          );

          return;
        }
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "pan"
      ) {
        const docsResponse = await getCandidateDocuments(Number(id));
        const docs = docsResponse.data || [];

        const panDoc = docs.find((doc: any) => doc.document_type === "PAN");

        if (!panDoc) {
          alert("PAN document not found");
          return;
        }

        const response = await verifyPAN(
          Number(id),
          candidate.bgv_id,
          panDoc.id,
        );
        const result = await getPANResult(Number(id));

        // FIX 2: Store total response object instead of result.data
        setPanResult(result);
        setShowPanResult(true);

        // FIX 3: Object navigation pathway fixed
        const verification = result?.data?.verification_result;

        // FIX 4: Better evaluation approach
        const isMatched =
          verification?.pan_match_status === "MATCH" &&
          verification?.name_match_status === "MATCH" &&
          verification?.dob_match_status === "MATCH";

        setPanMatchStatus(isMatched ? "Match" : "Mismatch");

        // FIX 5: Fallback syntax option check for verifyPAN()
        resultStatus =
          response?.status === "success" || response?.data?.success
            ? "Verified"
            : "Not Verified";

        // ISSUE 2 — Verify PAN resets status to Verified/Not Verified
        setModuleStatuses((prev) => ({
          ...prev,
          PAN: resultStatus,
        }));

        setDecisionStatus((prev) => ({
          ...prev,
          PAN: resultStatus,
        }));

        await loadCandidate();
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "passport"
      ) {
        try {
          // =====================================================
          // GET CANDIDATE DOCUMENTS
          // =====================================================

          const docsResponse = await getCandidateDocuments(Number(id));

          const docs = docsResponse.data || [];

          console.log("PASSPORT DOCUMENTS:", docs);

          // =====================================================
          // FIND PASSPORT FRONT
          // =====================================================

          const frontPassportDoc = docs.find(
            (doc: any) =>
              doc.document_type?.trim().toLowerCase() === "passport front",
          );

          // =====================================================
          // FIND PASSPORT BACK
          // =====================================================

          const backPassportDoc = docs.find(
            (doc: any) =>
              doc.document_type?.trim().toLowerCase() === "passport back",
          );

          // =====================================================
          // VALIDATE FRONT DOCUMENT
          // =====================================================

          if (!frontPassportDoc) {
            alert("Passport Front document not found");
            console.error(
              "Passport Front document not found. Available documents:",
              docs,
            );
            return;
          }

          // =====================================================
          // VALIDATE BACK DOCUMENT
          // =====================================================

          if (!backPassportDoc) {
            alert("Passport Back document not found");
            console.error(
              "Passport Back document not found. Available documents:",
              docs,
            );
            return;
          }

          // =====================================================
          // VALIDATE BGV ID
          // =====================================================

          if (!candidate.bgv_id) {
            alert("BGV ID not found for this candidate");
            return;
          }

          // =====================================================
          // PASSPORT REQUEST
          // =====================================================

          const passportRequest = {
            candidate_id: Number(id),
            bgv_id: candidate.bgv_id,
            front_document_id: Number(frontPassportDoc.id),
            back_document_id: Number(backPassportDoc.id),
          };

          console.log("=====================================================");
          console.log("PASSPORT REQUEST:", passportRequest);
          console.log("FRONT DOCUMENT:", frontPassportDoc);
          console.log("BACK DOCUMENT:", backPassportDoc);
          console.log("=====================================================");

          // =====================================================
          // VERIFY PASSPORT
          // =====================================================

          const response = await verifyPassport(
            Number(id),
            candidate.bgv_id,
            Number(frontPassportDoc.id),
            Number(backPassportDoc.id),
          );

          console.log("PASSPORT VERIFY RESPONSE:", response);

          // =====================================================
          // STOP IF VERIFICATION FAILED
          // =====================================================

          if (response?.status !== "success") {
            alert(response?.message || "Passport verification failed");

            return;
          }

          // =====================================================
          // GET PASSPORT RESULT
          // =====================================================

          const result = await getPassportResult(Number(id));

          console.log("PASSPORT RESULT:", result);

          setPassportResult(result);

          setShowPassportResult(true);

          // =====================================================
          // UPDATE PASSPORT STATUS
          // =====================================================

          // Actual Passport API response structure:
          //
          // result
          //   └── data
          //        └── data
          //             └── verification
          //                  └── verification_status

          const verification = result?.data?.data?.verification ?? null;

          const passportMatchStatus = String(
            verification?.passport_match_status ?? "",
          )
            .trim()
            .toUpperCase();

          const nameMatchStatus = String(verification?.name_match_status ?? "")
            .trim()
            .toUpperCase();

          const dobMatchStatus = String(verification?.dob_match_status ?? "")
            .trim()
            .toUpperCase();

          const isPassportMatch =
            passportMatchStatus === "MATCH" &&
            nameMatchStatus === "MATCH" &&
            dobMatchStatus === "MATCH";

          setPassportStatus(isPassportMatch ? "MATCH" : "NOT MATCH");

          console.log("PASSPORT MATCH RESULT AFTER VERIFY:", {
            passportMatchStatus,
            nameMatchStatus,
            dobMatchStatus,
            final: isPassportMatch ? "MATCH" : "NOT MATCH",
          });

          const verificationStatus =
            result?.data?.data?.verification?.verification_status ??
            result?.data?.verification?.verification_status ??
            result?.data?.verification_status ??
            result?.verification?.verification_status ??
            result?.verification_status ??
            "";

          console.log(
            "PASSPORT FINAL VERIFICATION STATUS:",
            verificationStatus,
          );

          resultStatus =
            verificationStatus.toUpperCase() === "VERIFIED"
              ? "Verified"
              : verificationStatus.toUpperCase() === "REJECTED"
                ? "Rejected"
                : verificationStatus.toUpperCase() === "FRAUD"
                  ? "Fraud"
                  : "Not Verified";

          // =====================================================
          // KEEP PASSPORT CARD PERMANENTLY IN COMPLETED STATE
          // =====================================================

          setModuleStatuses((prev) => ({
            ...prev,
            Passport: resultStatus,
          }));

          setDecisionStatus((prev) => ({
            ...prev,
            Passport: resultStatus,
          }));

          // =====================================================
          // RELOAD SAVED DATABASE STATE
          // =====================================================

          await loadCandidate();
          await loadCandidate();
          setDecisionStatus((prev) => ({
            ...prev,
            Passport: resultStatus,
          }));
        } catch (error: any) {
          console.error("PASSPORT VERIFICATION ERROR:", error);

          alert(
            error?.response?.data?.message ||
              error?.message ||
              "Passport verification failed",
          );
        }
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "driving-license"
      ) {
        try {
          // =====================================================
          // GET CANDIDATE DOCUMENTS
          // =====================================================

          const docsResponse = await getCandidateDocuments(Number(id));

          const docs = docsResponse.data || [];

          console.log("DRIVING LICENSE DOCUMENTS:", docs);

          // =====================================================
          // FIND DRIVING LICENSE FRONT
          // =====================================================

          const frontDrivingLicenseDoc = docs.find(
            (doc: any) =>
              doc.document_type?.trim().toLowerCase() ===
              "driving license front",
          );

          // =====================================================
          // FIND DRIVING LICENSE BACK
          // =====================================================

          const backDrivingLicenseDoc = docs.find(
            (doc: any) =>
              doc.document_type?.trim().toLowerCase() ===
              "driving license back",
          );

          // =====================================================
          // VALIDATE FRONT
          // =====================================================

          if (!frontDrivingLicenseDoc) {
            alert("Driving License Front document not found");

            console.error(
              "Driving License Front document not found. Available documents:",
              docs,
            );

            return;
          }

          // =====================================================
          // VALIDATE BACK
          // =====================================================

          if (!backDrivingLicenseDoc) {
            alert("Driving License Back document not found");

            console.error(
              "Driving License Back document not found. Available documents:",
              docs,
            );

            return;
          }

          // =====================================================
          // VALIDATE BGV ID
          // =====================================================

          if (!candidate.bgv_id) {
            alert("BGV ID not found for this candidate");
            return;
          }

          // =====================================================
          // VERIFY DRIVING LICENSE
          // =====================================================

          const response = await verifyDrivingLicense(
            Number(id),
            candidate.bgv_id,
            Number(frontDrivingLicenseDoc.id),
            Number(backDrivingLicenseDoc.id),
          );

          console.log("DRIVING LICENSE VERIFY RESPONSE:", response);

          // =====================================================
          // STOP IF VERIFICATION FAILED
          // =====================================================

          if (response?.status === "error" || response?.success === false) {
            alert(response?.message || "Driving License verification failed");

            return;
          }

          // =====================================================
          // GET SAVED RESULT
          // =====================================================

          const result = await getDrivingLicenseResult(Number(id));

          console.log("DRIVING LICENSE RESULT:", result);

          setDrivingLicenseResult(result);

          // =====================================================
          // SHOW RESULT
          // =====================================================

          setShowDrivingLicenseResult(true);

          // =====================================================
          // EXTRACT MATCH RESULTS
          // =====================================================

          const verification =
            result?.data?.comparison ??
            result?.data?.data?.comparison ??
            result?.comparison ??
            {};

          const dlMatch =
            verification?.driving_license_number ??
            verification?.dl_number ??
            result?.data?.dl_number_match_status ??
            result?.data?.data?.dl_number_match_status ??
            result?.dl_number_match_status ??
            "";

          const nameMatch =
            verification?.name ??
            result?.data?.name_match_status ??
            result?.data?.data?.name_match_status ??
            result?.name_match_status ??
            "";

          const dobMatch =
            verification?.date_of_birth ??
            verification?.dob ??
            result?.data?.dob_match_status ??
            result?.data?.data?.dob_match_status ??
            result?.dob_match_status ??
            "";

          const addressMatch =
            verification?.address ??
            result?.data?.address_match_status ??
            result?.data?.data?.address_match_status ??
            result?.address_match_status ??
            "";

          const isDrivingLicenseMatch =
            String(dlMatch).trim().toUpperCase() === "MATCH" &&
            String(nameMatch).trim().toUpperCase() === "MATCH" &&
            String(dobMatch).trim().toUpperCase() === "MATCH" &&
            String(addressMatch).trim().toUpperCase() === "MATCH";

          setDrivingLicenseMatchStatus(
            isDrivingLicenseMatch ? "Match" : "Not Match",
          );

          console.log("DRIVING LICENSE MATCH RESULT:", {
            dlMatch,
            nameMatch,
            dobMatch,
            addressMatch,
            final: isDrivingLicenseMatch ? "Match" : "Not Match",
          });

          // =====================================================
          // RESTORE VERIFICATION STATUS
          // =====================================================

          const verificationStatus =
            result?.data?.verification_status ??
            result?.data?.data?.verification_status ??
            result?.verification_status ??
            "";

          const normalizedStatus = String(verificationStatus)
            .trim()
            .toUpperCase();

          resultStatus =
            normalizedStatus === "VERIFIED" || normalizedStatus === "APPROVED"
              ? "Verified"
              : normalizedStatus === "FRAUD"
                ? "Fraud"
                : normalizedStatus === "REJECTED"
                  ? "Rejected"
                  : "Not Verified";

          // =====================================================
          // KEEP CARD COMPLETED
          // =====================================================

          setModuleStatuses((prev) => ({
            ...prev,
            "Driving License": resultStatus,
          }));

          setDecisionStatus((prev) => ({
            ...prev,
            "Driving License": resultStatus,
          }));

          await loadCandidate();

          // Restore the complete saved Driving License state
          await restoreDrivingLicenseResult();
        } catch (error: any) {
          console.error("DRIVING LICENSE VERIFICATION ERROR:", error);

          alert(
            error?.response?.data?.message ||
              error?.message ||
              "Driving License verification failed",
          );
        }
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "face-match"
      ) {
        const docsResponse = await getCandidateDocuments(Number(id));

        const docs = docsResponse.data || [];

        const selfie = docs.find((doc: any) => doc.document_type === "Selfie");

        if (!selfie) {
          alert("Selfie not found");
          return;
        }

        await verifyFaceMatch(Number(id), candidate.bgv_id, selfie.id);

        const result = await getFaceMatchResult(Number(id));

        setFaceMatchResult(result);

        await loadFaceMatchImages();

        setShowFaceMatchResult(true);

        const status =
          result?.data?.verification_status ??
          result?.data?.data?.verification_status ??
          "";

        setFaceMatchStatus(status);

        const confidence =
          result?.data?.confidence_score ??
          result?.data?.data?.confidence_score ??
          0;

        setFaceMatchRisk(confidence >= 0.7 ? "LOW" : "HIGH");

        resultStatus =
          result?.data?.verification_status === "MATCH"
            ? "Verified"
            : "Not Verified";

        setModuleStatuses((prev) => ({
          ...prev,
          "Face Match": resultStatus,
        }));

        setDecisionStatus((prev) => ({
          ...prev,
          "Face Match": resultStatus,
        }));

        await loadCandidate();
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "deepfake"
      ) {
        const docsResponse = await getCandidateDocuments(Number(id));

        const docs = docsResponse.data || [];

        const selfie = docs.find((doc: any) => doc.document_type === "Selfie");

        if (!selfie) {
          alert("Selfie not found");

          return;
        }

        const response = await verifyDeepfake(
          Number(id),

          candidate.bgv_id,
          selfie.id,
        );

        const result = await getDeepfakeResult(Number(id));

        setDeepfakeResult(result);

        setShowDeepfakeResult(true);

        const probability =
          result?.fake_probability || result?.data?.fake_probability || 0;

        setDeepfakeRisk(probability >= 0.5 ? "HIGH" : "LOW");

        resultStatus = response.success ? "Verified" : "Fraud";

        setModuleStatuses((prev) => ({
          ...prev,

          "Deepfake Detection": resultStatus,
        }));

        setDecisionStatus((prev) => ({
          ...prev,

          "Deepfake Detection": resultStatus,
        }));

        await loadCandidate();
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "salary-slip"
      ) {
        const docsResponse = await getCandidateDocuments(Number(id));

        const docs = docsResponse.data || [];

        const salarySlipDoc = docs.find(
          (doc: any) =>
            doc.document_type?.toLowerCase() === "salary slip" ||
            doc.document_type?.toLowerCase() === "salary_slip",
        );

        if (!salarySlipDoc) {
          alert("Salary Slip document not found");
          return;
        }

        if (!candidate.bgv_id) {
          alert("BGV ID not found for this candidate");
          return;
        }

        console.log("SALARY SLIP REQUEST:", {
          candidate_id: Number(id),
          bgv_id: candidate.bgv_id,
          document_id: Number(salarySlipDoc.id),
        });

        const result = await verifySalarySlip(
          Number(id),
          candidate.bgv_id,
          Number(salarySlipDoc.id),
        );

        console.log("SALARY SLIP OCR RESULT");
        console.log(result);

        setSalarySlipResult(result);
        setShowSalarySlipResult(true);

        resultStatus = result?.success ? "Verified" : "Not Verified";

        setModuleStatuses((prev) => ({
          ...prev,
          "Salary Slip": resultStatus,
        }));

        setDecisionStatus((prev) => ({
          ...prev,
          "Salary Slip": resultStatus,
        }));

        await loadCandidate();
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "employment"
      ) {
        try {
          // =====================================================
          // VALIDATE BGV ID
          // =====================================================

          if (!candidate.bgv_id) {
            alert("BGV ID not found for this candidate");
            return;
          }

          // =====================================================
          // EMPLOYMENT VERIFICATION REQUEST
          // =====================================================

          console.log("=====================================================");
          console.log("EMPLOYMENT VERIFICATION REQUEST");
          console.log("=====================================================");
          console.log("Candidate ID:", Number(id));
          console.log("BGV ID:", candidate.bgv_id);
          console.log("=====================================================");

          const response = await verifyEmployment(Number(id), candidate.bgv_id);

          console.log("EMPLOYMENT VERIFY RESPONSE:", response);

          // =====================================================
          // HANDLE MANUAL VERIFICATION
          // =====================================================

          if (response?.status === "MANUAL_VERIFICATION_REQUIRED") {
            alert(
              response?.message ||
                "Manual Employment Verification is required.",
            );

            return;
          }

          // =====================================================
          // HANDLE VERIFICATION FAILURE
          // =====================================================

          if (response?.success === false || response?.status === "error") {
            alert(response?.message || "Employment verification failed.");

            return;
          }

          // =====================================================
          // GET EMPLOYMENT RESULT
          // =====================================================

          const result = await getEmploymentResult(Number(id));

          console.log("EMPLOYMENT RESULT:", result);

          setEmploymentResult(result);

          setShowEmploymentResult(true);

          // =====================================================
          // UPDATE EMPLOYMENT CARD STATUS
          // =====================================================

          resultStatus = "Verified";

          setModuleStatuses((prev) => ({
            ...prev,
            Employment: resultStatus,
          }));

          setDecisionStatus((prev) => ({
            ...prev,
            Employment: resultStatus,
          }));

          // =====================================================
          // RELOAD CANDIDATE
          // =====================================================

          await loadCandidate();
        } catch (error: any) {
          console.error("EMPLOYMENT VERIFICATION ERROR:", error);

          alert(
            error?.response?.data?.message ||
              error?.message ||
              "Employment verification failed.",
          );
        }
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "credit-bureau"
      ) {
        try {
          // =====================================================
          // VALIDATE BGV ID
          // =====================================================

          if (!candidate.bgv_id) {
            alert("BGV ID not found for this candidate");
            return;
          }

          // =====================================================
          // CREDIT BUREAU VERIFICATION
          // =====================================================

          console.log("=====================================================");
          console.log("CREDIT BUREAU VERIFICATION REQUEST");
          console.log("=====================================================");
          console.log("Candidate ID:", Number(id));
          console.log("BGV ID:", candidate.bgv_id);
          console.log("=====================================================");

          const result = await getCreditBureauResult(Number(id));

          console.log("CREDIT BUREAU DUMMY RESULT:", result);

          if (!result) {
            alert("Credit Bureau result not found.");
            return;
          }

          setCreditBureauResult(result);
          setShowCreditBureauResult(true);
        } catch (error: any) {
          console.error("CREDIT BUREAU VERIFICATION ERROR:", error);

          alert(
            error?.response?.data?.message ||
              error?.message ||
              "Credit Bureau verification failed.",
          );
        }
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "bank-statement"
      ) {
        try {
          // =====================================================
          // VALIDATE BGV ID
          // =====================================================

          if (!candidate.bgv_id) {
            alert("BGV ID not found for this candidate");
            return;
          }

          console.log("=====================================================");
          console.log("BANK STATEMENT VERIFICATION");
          console.log("=====================================================");
          console.log("Candidate ID:", Number(id));
          console.log("BGV ID:", candidate.bgv_id);
          console.log("=====================================================");

          // =====================================================
          // GET CANDIDATE DOCUMENTS
          // =====================================================

          const docsResponse = await getCandidateDocuments(Number(id));

          const docs = docsResponse.data || [];

          console.log("BANK STATEMENT DOCUMENTS:", docs);

          // =====================================================
          // FIND BANK STATEMENT
          // =====================================================

          const bankStatementDoc = docs.find(
            (doc: any) =>
              String(doc.document_type || "")
                .trim()
                .toLowerCase() === "bank statement",
          );

          if (!bankStatementDoc) {
            alert("Bank Statement document not found");
            return;
          }

          console.log("BANK STATEMENT DOCUMENT:", bankStatementDoc);

          // =====================================================
          // START BANK STATEMENT VERIFICATION
          // =====================================================

          const response = await verifyBankStatement(
            Number(id),
            candidate.bgv_id,
            Number(bankStatementDoc.id),
          );

          console.log("BANK STATEMENT VERIFY RESPONSE:", response);

          // =====================================================
          // HANDLE API FAILURE
          // =====================================================

          if (response?.success === false || response?.status === "error") {
            alert(response?.message || "Bank Statement verification failed.");

            return;
          }

          // =====================================================
          // CHECK INITIAL STATUS
          // =====================================================

          const verificationCode =
            response?.data?.code ?? response?.data?.data?.code ?? "";

          const verificationStatus =
            response?.data?.verification_status ??
            response?.data?.data?.verification_status ??
            response?.verification_status ??
            "";

          const normalizedCode = String(verificationCode).trim();

          const normalizedStatus = String(verificationStatus)
            .trim()
            .toUpperCase();

          console.log("BANK STATEMENT GRIDLINES CODE:", normalizedCode);
          console.log("BANK STATEMENT INITIAL STATUS:", normalizedStatus);

          // =====================================================
          // PROCESSING / REQUESTED
          // =====================================================

          if (
            normalizedCode === "1019" ||
            normalizedStatus === "REQUESTED" ||
            normalizedStatus === "IN_PROGRESS" ||
            normalizedStatus === "PROCESSING"
          ) {
            setModuleStatuses((prev) => ({
              ...prev,
              "Bank Statement": "Not Verified",
            }));

            console.log(
              "BANK STATEMENT: Upload successful, report generation in progress.",
            );

            alert(
              "Bank Statement uploaded successfully. The report is being generated.",
            );

            return;
          }

          // =====================================================
          // TRY TO LOAD SAVED RESULT
          // =====================================================

          const result = await getBankStatementResult(
            Number(id),
            candidate.bgv_id,
          );

          console.log("BANK STATEMENT RESULT:", result);

          if (!result) {
            alert("Bank Statement result is not available yet.");
            return;
          }

          // =====================================================
          // STORE RESULT
          // =====================================================

          setBankStatementResult(result);
          setShowBankStatementResult(true);

          // =====================================================
          // DETERMINE CARD STATUS
          // =====================================================

          const finalStatus =
            result?.data?.verification_status ??
            result?.data?.data?.verification_status ??
            result?.data?.result?.verification_status ??
            result?.data?.data?.result?.verification_status ??
            result?.verification_status ??
            "";

          const normalizedFinalStatus = String(finalStatus)
            .trim()
            .toUpperCase();

          if (
            normalizedFinalStatus === "VERIFIED" ||
            normalizedFinalStatus === "COMPLETED" ||
            normalizedFinalStatus === "CLEAR" ||
            normalizedFinalStatus === "SUCCESS"
          ) {
            resultStatus = "Verified";
          } else if (normalizedFinalStatus === "FRAUD") {
            resultStatus = "Fraud";
          } else if (normalizedFinalStatus === "REJECTED") {
            resultStatus = "Rejected";
          } else {
            resultStatus = "Not Verified";
          }

          setModuleStatuses((prev) => ({
            ...prev,
            "Bank Statement": resultStatus,
          }));

          console.log("BANK STATEMENT FINAL STATUS:", resultStatus);

          // =====================================================
          // REFRESH CANDIDATE / SUMMARY
          // =====================================================

          await loadCandidate();
        } catch (error: any) {
          console.error("BANK STATEMENT VERIFICATION ERROR:", error);

          alert(
            error?.response?.data?.message ||
              error?.message ||
              "Bank Statement verification failed.",
          );
        }
      } else if (
        verificationModules[moduleName as keyof typeof verificationModules]
          ?.type === "ccrv"
      ) {
        try {
          // =====================================================
          // VALIDATE BGV ID
          // =====================================================

          if (!candidate.bgv_id) {
            alert("BGV ID not found for this candidate");
            return;
          }

          console.log("=====================================================");
          console.log("COURT RECORD VERIFICATION");
          console.log("=====================================================");
          console.log("Candidate ID:", Number(id));
          console.log("BGV ID:", candidate.bgv_id);
          console.log("=====================================================");

          // =====================================================
          // STEP 1 — START CCRV VERIFICATION
          // =====================================================

          const verifyResponse = await verifyCourtRecord(
            Number(id),
            candidate.bgv_id,
          );

          console.log("COURT RECORD VERIFY RESPONSE:", verifyResponse);

          // =====================================================
          // HANDLE API ERROR
          // =====================================================

          if (
            verifyResponse?.success === false ||
            verifyResponse?.status === "error"
          ) {
            alert(
              verifyResponse?.message || "Court Record verification failed.",
            );

            return;
          }

          // =====================================================
          // CHECK INITIAL STATUS
          // =====================================================

          const initialStatus =
            verifyResponse?.data?.verification_status ??
            verifyResponse?.data?.ccrv_status ??
            verifyResponse?.verification_status ??
            verifyResponse?.ccrv_status ??
            "";

          const normalizedInitialStatus = String(initialStatus)
            .trim()
            .toUpperCase();

          console.log("COURT RECORD INITIAL STATUS:", normalizedInitialStatus);

          // =====================================================
          // REQUESTED / IN_PROGRESS
          // =====================================================

          if (
            normalizedInitialStatus === "REQUESTED" ||
            normalizedInitialStatus === "IN_PROGRESS"
          ) {
            setModuleStatuses((prev) => ({
              ...prev,
              "Court Record": "In Progress" as VerificationStatus,
            }));

            alert(
              "Court Record verification has been initiated. The report is still being processed.",
            );

            return;
          }

          // =====================================================
          // STEP 2 — GET RESULT
          // =====================================================

          const result = await getCourtRecordResult(Number(id));

          console.log("COURT RECORD RESULT:", result);

          if (!result) {
            alert("Court Record result not found.");
            return;
          }

          // =====================================================
          // CHECK RESULT STATUS
          // =====================================================

          const ccrvResultStatus =
            result?.data?.verification_status ??
            result?.data?.ccrv_status ??
            result?.verification_status ??
            result?.ccrv_status ??
            "";

          const normalizedResultStatus = String(ccrvResultStatus)
            .trim()
            .toUpperCase();

          console.log("COURT RECORD RESULT STATUS:", normalizedResultStatus);

          // =====================================================
          // STILL PROCESSING
          // =====================================================

          if (
            normalizedResultStatus === "REQUESTED" ||
            normalizedResultStatus === "IN_PROGRESS"
          ) {
            setModuleStatuses((prev) => ({
              ...prev,
              "Court Record": "In Progress" as VerificationStatus,
            }));

            alert("Court Record verification is still in progress.");

            return;
          }

          // =====================================================
          // FAILED
          // =====================================================

          if (normalizedResultStatus === "FAILED") {
            setModuleStatuses((prev) => ({
              ...prev,
              "Court Record": "Rejected",
            }));

            alert("Court Record verification failed.");

            return;
          }

          // =====================================================
          // STORE COMPLETED RESULT
          // =====================================================

          setCourtRecordResult(result);

          setShowCourtRecordResult(true);

          // =====================================================
          // DETERMINE FINAL STATUS
          // =====================================================

          const finalVerificationStatus =
            result?.data?.verification_status ??
            result?.data?.report?.verification_status ??
            result?.verification_status ??
            "";

          const normalizedFinalStatus = String(finalVerificationStatus)
            .trim()
            .toUpperCase();

          let finalStatus: VerificationStatus;

          if (
            normalizedFinalStatus === "VERIFIED" ||
            normalizedFinalStatus === "CLEAR"
          ) {
            finalStatus = "Verified";
          } else if (normalizedFinalStatus === "FRAUD") {
            finalStatus = "Fraud";
          } else if (normalizedFinalStatus === "REJECTED") {
            finalStatus = "Rejected";
          } else {
            finalStatus = "Not Verified";
          }

          // =====================================================
          // UPDATE CARD STATUS
          // =====================================================

          setModuleStatuses((prev) => ({
            ...prev,
            "Court Record": finalStatus,
          }));

          console.log("COURT RECORD FINAL STATUS:", finalStatus);

          // =====================================================
          // REFRESH SUMMARY
          // =====================================================

          await loadCandidate();

          console.log("=====================================================");
          console.log("COURT RECORD VERIFICATION COMPLETED");
          console.log("=====================================================");
        } catch (error: any) {
          console.error("COURT RECORD VERIFICATION ERROR:", error);

          alert(
            error?.response?.data?.message ||
              error?.message ||
              "Court Record verification failed.",
          );
        }
      } else if (moduleName === "Resume Parsing") {
        await loadCandidate();
      }
    } catch (error) {
      console.error(error);
      alert(`${moduleName} failed`);
    } finally {
      setVerifying((prev) => ({
        ...prev,
        [moduleName]: false,
      }));
    }
  };

  if (!candidate)
    return (
      <DashboardLayout>
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate(`/candidates/${candidate.id}`);
            }
          }}
          className="flex items-center text-gray-500 mb-4 hover:text-gray-800 transition-all"
        >
          <ArrowLeft className="mr-2" /> Back to Candidate Profile
        </button>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Audit Hub: {candidate.full_name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Run specific verification modules on the candidate's submitted
              documents.
            </p>
          </div>
          <div className="text-sm font-bold bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl w-full md:w-auto text-center md:text-left">
            Candidate ID: #{candidate.id}
          </div>
        </div>

        {modules.map((group) => (
          <div key={group.title} className="space-y-4">
            <h2 className="font-bold text-gray-500 uppercase text-xs tracking-wider ml-1">
              {group.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items.map((item) => {
                const status = moduleStatuses[item];
                const isVerifying = verifying[item];
                const moduleConfig =
                  verificationModules[item as keyof typeof verificationModules];
                const moduleKey = moduleConfig?.key || item;

                return (
                  <VerificationCard
                    key={item}
                    title={item}
                    subtitle={
                      verificationModules[
                        item as keyof typeof verificationModules
                      ]?.subtitle
                    }
                    status={status}
                    verifying={isVerifying}
                  >
                    <div className="flex items-center gap-2">
                      {status ? (
                        <>
                          {moduleConfig?.type === "aadhaar" && (
                            <VerificationModuleCard
                              moduleName="Aadhaar"
                              status={status || ""}
                              verificationStatus={
                                aadhaarMatchStatus || "UNKNOWN"
                              }
                              decisionValue={decisionStatus["Aadhaar"] || ""}
                              onVerify={() => {
                                handleVerify("Aadhaar");
                              }}
                              onViewResult={async () => {
                                try {
                                  console.log(
                                    "========================================",
                                  );
                                  console.log("LOADING AADHAAR RESULT");
                                  console.log("CANDIDATE ID:", Number(id));
                                  console.log(
                                    "========================================",
                                  );

                                  // =====================================================
                                  // STEP 1 — GET GRIDLINES / UIDAI RESULT
                                  // =====================================================

                                  const result = await getAadhaarResult(
                                    Number(id),
                                  );

                                  console.log("SAVED AADHAAR RESULT:", result);

                                  if (!result) {
                                    alert(
                                      "Aadhaar verification result not found",
                                    );
                                    return;
                                  }

                                  setAadhaarResult(result);

                                  // =====================================================
                                  // STEP 2 — GET CANDIDATE UPLOADED DOCUMENTS
                                  // =====================================================

                                  const documentsResponse =
                                    await getCandidateDocuments(Number(id));

                                  console.log(
                                    "CANDIDATE DOCUMENTS:",
                                    documentsResponse,
                                  );

                                  const documents =
                                    documentsResponse?.data ||
                                    documentsResponse ||
                                    [];

                                  // =====================================================
                                  // STEP 3 — FIND CANDIDATE AADHAAR
                                  // =====================================================

                                  const uploadedAadhaar = documents.find(
                                    (document: any) =>
                                      String(document.document_type || "")
                                        .trim()
                                        .toLowerCase() === "aadhaar",
                                  );

                                  console.log(
                                    "CANDIDATE AADHAAR DOCUMENT:",
                                    uploadedAadhaar,
                                  );

                                  if (uploadedAadhaar) {
                                    setAadhaarDocument(uploadedAadhaar);
                                  } else {
                                    console.warn(
                                      "Candidate Aadhaar document not found",
                                    );

                                    setAadhaarDocument(null);
                                  }

                                  // =====================================================
                                  // STEP 4 — NORMALIZE GRIDLINES RESULT
                                  // =====================================================

                                  const resultData =
                                    result?.data?.data ??
                                    result?.data ??
                                    result ??
                                    {};

                                  console.log(
                                    "NORMALIZED AADHAAR RESULT:",
                                    resultData,
                                  );

                                  // =====================================================
                                  // STEP 5 — RESTORE MATCH STATUS
                                  // =====================================================

                                  const nameMatchStatus = String(
                                    resultData?.name_match_status ?? "",
                                  )
                                    .trim()
                                    .toUpperCase();

                                  const dobMatchStatus = String(
                                    resultData?.dob_match_status ?? "",
                                  )
                                    .trim()
                                    .toUpperCase();

                                  const isAadhaarMatch =
                                    nameMatchStatus === "MATCH" &&
                                    dobMatchStatus === "MATCH";

                                  setAadhaarMatchStatus(
                                    isAadhaarMatch ? "MATCH" : "NOT MATCH",
                                  );

                                  console.log("AADHAAR MATCH:", {
                                    nameMatchStatus,
                                    dobMatchStatus,
                                    final: isAadhaarMatch
                                      ? "MATCH"
                                      : "NOT MATCH",
                                  });

                                  // =====================================================
                                  // STEP 6 — OPEN RESULT MODAL
                                  // =====================================================

                                  setShowAadhaarResult(true);
                                } catch (error: any) {
                                  console.error(
                                    "Failed loading Aadhaar result:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      "Unable to load Aadhaar result",
                                  );
                                }
                              }}
                              onDecisionChange={async (decision) => {
                                try {
                                  console.log("SAVING AADHAAR DECISION:", {
                                    candidateId: Number(id),
                                    decision,
                                  });

                                  await saveAadhaarDecision(
                                    Number(id),
                                    decision,
                                  );

                                  // Update UI immediately
                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    Aadhaar: decision,
                                  }));

                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    Aadhaar: decision as VerificationStatus,
                                  }));

                                  console.log(
                                    "AADHAAR DECISION SAVED:",
                                    decision,
                                  );
                                } catch (error) {
                                  console.error(
                                    "FAILED TO SAVE AADHAAR DECISION:",
                                    error,
                                  );

                                  alert("Failed to update Aadhaar decision");
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "passport" && (
                            <VerificationModuleCard
                              moduleName="Passport"
                              status={status || ""}
                              verificationStatus={passportStatus}
                              decisionValue={decisionStatus["Passport"] || ""}
                              onVerify={() => handleVerify("Passport")}
                              onViewResult={async () => {
                                try {
                                  console.log(
                                    "Loading saved Passport result...",
                                  );

                                  const result = await getPassportResult(
                                    Number(id),
                                  );

                                  console.log("SAVED PASSPORT RESULT:", result);

                                  if (!result) {
                                    alert(
                                      "Passport verification result not found",
                                    );
                                    return;
                                  }

                                  setPassportResult(result);
                                  const verification =
                                    result?.data?.data?.verification ?? null;

                                  const passportMatchStatus = String(
                                    verification?.passport_match_status ?? "",
                                  )
                                    .trim()
                                    .toUpperCase();

                                  const nameMatchStatus = String(
                                    verification?.name_match_status ?? "",
                                  )
                                    .trim()
                                    .toUpperCase();

                                  const dobMatchStatus = String(
                                    verification?.dob_match_status ?? "",
                                  )
                                    .trim()
                                    .toUpperCase();

                                  const isPassportMatch =
                                    passportMatchStatus === "MATCH" &&
                                    nameMatchStatus === "MATCH" &&
                                    dobMatchStatus === "MATCH";

                                  setPassportStatus(
                                    isPassportMatch ? "MATCH" : "NOT MATCH",
                                  );
                                  // Restore the saved verification status as well.
                                  const savedVerificationStatus =
                                    result?.data?.data?.verification
                                      ?.verification_status ??
                                    result?.data?.verification
                                      ?.verification_status ??
                                    result?.verification?.verification_status ??
                                    result?.data?.verification_status ??
                                    result?.verification_status ??
                                    "";

                                  if (savedVerificationStatus) {
                                    const normalizedStatus =
                                      savedVerificationStatus.toUpperCase();

                                    if (normalizedStatus === "VERIFIED") {
                                      setModuleStatuses((prev) => ({
                                        ...prev,
                                        Passport: "Verified",
                                      }));

                                      setDecisionStatus((prev) => ({
                                        ...prev,
                                        Passport: "Verified",
                                      }));
                                    } else if (
                                      normalizedStatus === "REJECTED"
                                    ) {
                                      setModuleStatuses((prev) => ({
                                        ...prev,
                                        Passport: "Rejected",
                                      }));

                                      setDecisionStatus((prev) => ({
                                        ...prev,
                                        Passport: "Rejected",
                                      }));
                                    } else if (normalizedStatus === "FRAUD") {
                                      setModuleStatuses((prev) => ({
                                        ...prev,
                                        Passport: "Fraud",
                                      }));

                                      setDecisionStatus((prev) => ({
                                        ...prev,
                                        Passport: "Fraud",
                                      }));
                                    }
                                  }

                                  setShowPassportResult(true);
                                } catch (error: any) {
                                  console.error(
                                    "Failed loading saved Passport result:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      "Unable to load Passport result",
                                  );
                                }
                              }}
                              onDecisionChange={async (decision) => {
                                try {
                                  await savePassportDecision(
                                    Number(id),
                                    decision,
                                  );

                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    Passport: decision,
                                  }));

                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    Passport: decision as VerificationStatus,
                                  }));

                                  // await loadCandidate();
                                } catch (error) {
                                  console.error(error);
                                  alert("Failed to update Passport decision");
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "driving-license" && (
                            <VerificationModuleCard
                              moduleName="Driving License"
                              status={status || ""}
                              verificationStatus={
                                drivingLicenseMatchStatus || "UNKNOWN"
                              }
                              decisionValue={
                                decisionStatus["Driving License"] || ""
                              }
                              onVerify={() => {
                                handleVerify("Driving License");
                              }}
                              onViewResult={async () => {
                                try {
                                  console.log(
                                    "Loading saved Driving License result...",
                                  );

                                  const result = await getDrivingLicenseResult(
                                    Number(id),
                                  );

                                  console.log(
                                    "SAVED DRIVING LICENSE RESULT:",
                                    result,
                                  );

                                  if (!result) {
                                    alert(
                                      "Driving License verification result not found",
                                    );
                                    return;
                                  }

                                  setDrivingLicenseResult(result);

                                  // Restore saved state
                                  await restoreDrivingLicenseResult();

                                  setShowDrivingLicenseResult(true);
                                } catch (error: any) {
                                  console.error(
                                    "Failed loading saved Driving License result:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      "Unable to load Driving License result",
                                  );
                                }
                              }}
                              onDecisionChange={async (decision) => {
                                try {
                                  // =================================================
                                  // SAVE DECISION TO BACKEND
                                  // =================================================

                                  await saveDrivingLicenseDecision(
                                    Number(id),
                                    decision,
                                  );

                                  // =================================================
                                  // UPDATE FRONTEND DECISION
                                  // =================================================

                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    "Driving License": decision,
                                  }));

                                  // =================================================
                                  // UPDATE CARD STATUS
                                  // =================================================

                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    "Driving License":
                                      decision as VerificationStatus,
                                  }));

                                  // =================================================
                                  // IMPORTANT
                                  // Do not call loadCandidate() here.
                                  //
                                  // The backend has already saved:
                                  // - decision
                                  // - audit log
                                  // - notification
                                  //
                                  // Calling loadCandidate() immediately can overwrite
                                  // the locally selected decision with an old summary.
                                  // =================================================
                                } catch (error) {
                                  console.error(
                                    "Failed to update Driving License decision:",
                                    error,
                                  );

                                  alert(
                                    "Failed to update Driving License decision",
                                  );
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "watchlist" && (
                            <VerificationModuleCard
                              moduleName="Watchlist"
                              status={status}
                              riskLevel={riskLevels["Watchlist"]}
                              decisionValue={decisionStatus["Watchlist"] || ""}
                              onViewResult={() => {
                                setShowWatchlistModal(true);
                              }}
                              onVerify={() => {
                                handleVerify(moduleKey);
                              }}
                              onDecisionChange={async (decision) => {
                                try {
                                  await updateWatchlistDecision(
                                    Number(id),
                                    decision,
                                  );
                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    Watchlist: decision,
                                  }));
                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    Watchlist: decision,
                                  }));
                                  await loadCandidate();
                                } catch (error) {
                                  console.error(error);
                                  alert("Failed to update watchlist decision");
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "pan" && (
                            <PANVerificationCard
                              status={status || ""}
                              matchStatus={panMatchStatus}
                              // ISSUE 3: Retained decisionStatus["PAN"] as required
                              decisionValue={decisionStatus["PAN"] || ""}
                              onVerify={() => {
                                handleVerify("PAN");
                              }}
                              // FIX 7: Fetch data natively on click to address refresh drops
                              onViewResult={async () => {
                                try {
                                  const result = await getPANResult(Number(id));
                                  setPanResult(result);
                                  setShowPanResult(true);
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                              // ISSUE 1 — PAN dropdown updates database layout fixed
                              onDecisionChange={async (decision) => {
                                try {
                                  await savePANDecision(Number(id), decision);

                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    PAN: decision,
                                  }));

                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    PAN: decision as VerificationStatus,
                                  }));
                                } catch (error) {
                                  console.error(error);
                                  alert("Failed to update PAN decision");
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "salary-slip" && (
                            <SalarySlipVerificationCard
                              uanNumber={
                                salarySlipResult?.data?.uan_number ??
                                salarySlipResult?.uan_number ??
                                null
                              }
                              status={status || ""}
                              riskLevel={salarySlipRisk}
                              decisionValue={
                                decisionStatus["Salary Slip"] || ""
                              }
                              onViewResult={async () => {
                                try {
                                  const result = await getSalarySlipResult(
                                    Number(id),
                                  );

                                  console.log("SALARY RESULT");
                                  console.log(result);

                                  setSalarySlipResult(result);

                                  setShowSalarySlipResult(true);
                                } catch (error) {
                                  console.log(error);

                                  alert("Unable to load salary slip result");
                                }
                              }}
                              onVerify={() => handleVerify("Salary Slip")}
                              onDecisionChange={async (decision) => {
                                try {
                                  const response =
                                    await updateSalarySlipDecision(
                                      Number(id),
                                      decision,
                                    );

                                  if (!response?.success) {
                                    throw new Error(
                                      response?.message ||
                                        "Salary Slip decision update failed",
                                    );
                                  }

                                  setSalarySlipDecision(decision);

                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    "Salary Slip": decision,
                                  }));

                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    "Salary Slip":
                                      decision as VerificationStatus,
                                  }));

                                  await loadCandidate();
                                } catch (error) {
                                  console.error(
                                    "Failed to update Salary Slip decision:",
                                    error,
                                  );

                                  alert(
                                    "Failed to update Salary Slip decision",
                                  );
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "employment" && (
                            <VerificationModuleCard
                              moduleName="Employment"
                              status={status || ""}
                              decisionValue={decisionStatus["Employment"] || ""}
                              onVerify={() => {
                                handleVerify("Employment");
                              }}
                              onViewResult={async () => {
                                try {
                                  const result = await getEmploymentResult(
                                    Number(id),
                                  );

                                  console.log("EMPLOYMENT RESULT:", result);

                                  if (!result) {
                                    alert(
                                      "Employment verification result not found",
                                    );
                                    return;
                                  }

                                  setEmploymentResult(result);
                                  setShowEmploymentResult(true);
                                } catch (error: any) {
                                  console.error(
                                    "Failed loading Employment result:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      "Unable to load Employment result",
                                  );
                                }
                              }}
                              onDecisionChange={async (decision) => {
                                try {
                                  console.log("SAVING EMPLOYMENT DECISION:", {
                                    candidateId: Number(id),
                                    decision,
                                  });

                                  await saveEmploymentDecision(
                                    Number(id),
                                    decision,
                                  );

                                  // Update decision immediately
                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    Employment: decision,
                                  }));

                                  // Update card status immediately
                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    Employment: decision as VerificationStatus,
                                  }));

                                  console.log(
                                    "EMPLOYMENT DECISION SAVED:",
                                    decision,
                                  );
                                } catch (error: any) {
                                  console.error(
                                    "FAILED TO SAVE EMPLOYMENT DECISION:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      "Failed to update Employment decision",
                                  );
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "credit-bureau" && (
                            <VerificationModuleCard
                              moduleName="Credit Bureau"
                              status={status || ""}
                              decisionValue={
                                decisionStatus["Credit Bureau"] || ""
                              }
                              onVerify={() => {
                                handleVerify("Credit Bureau");
                              }}
                              onViewResult={async () => {
                                try {
                                  console.log(
                                    "Loading Credit Bureau result...",
                                  );

                                  const result = await getCreditBureauResult(
                                    Number(id),
                                  );

                                  console.log("CREDIT BUREAU RESULT:", result);

                                  if (!result) {
                                    alert(
                                      "Credit Bureau verification result not found",
                                    );
                                    return;
                                  }

                                  setCreditBureauResult(result);
                                  setShowCreditBureauResult(true);
                                } catch (error: any) {
                                  console.error(
                                    "Failed loading Credit Bureau result:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      "Unable to load Credit Bureau result",
                                  );
                                }
                              }}
                              onDecisionChange={async (decision) => {
                                try {
                                  console.log(
                                    "SAVING CREDIT BUREAU DECISION:",
                                    {
                                      candidateId: Number(id),
                                      decision,
                                    },
                                  );

                                  await saveCreditBureauDecision(
                                    Number(id),
                                    decision,
                                  );

                                  // Update decision immediately
                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    "Credit Bureau": decision,
                                  }));

                                  // Update card immediately
                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    "Credit Bureau":
                                      decision as VerificationStatus,
                                  }));

                                  console.log(
                                    "CREDIT BUREAU DECISION SAVED:",
                                    decision,
                                  );
                                } catch (error: any) {
                                  console.error(
                                    "FAILED TO SAVE CREDIT BUREAU DECISION:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      "Failed to update Credit Bureau decision",
                                  );
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "ccrv" && (
                            <VerificationModuleCard
                              moduleName="Court Record"
                              status={status || ""}
                              decisionValue={
                                decisionStatus["Court Record"] || ""
                              }
                              onVerify={() => {
                                handleVerify("Court Record");
                              }}
                              onViewResult={async () => {
                                try {
                                  console.log("Loading Court Record result...");

                                  const result = await getCourtRecordResult(
                                    Number(id),
                                  );

                                  console.log("COURT RECORD RESULT:", result);

                                  if (!result) {
                                    alert(
                                      "Court Record verification result not found",
                                    );
                                    return;
                                  }

                                  setCourtRecordResult(result);
                                  setShowCourtRecordResult(true);
                                } catch (error: any) {
                                  console.error(
                                    "Failed loading Court Record result:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      "Unable to load Court Record result",
                                  );
                                }
                              }}
                              onDecisionChange={async (decision) => {
                                try {
                                  console.log("SAVING COURT RECORD DECISION:", {
                                    candidateId: Number(id),
                                    decision,
                                  });

                                  await saveCourtRecordDecision(
                                    Number(id),
                                    decision,
                                  );

                                  // =================================================
                                  // UPDATE DECISION IMMEDIATELY
                                  // =================================================

                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    "Court Record": decision,
                                  }));

                                  // =================================================
                                  // UPDATE CARD STATUS IMMEDIATELY
                                  // =================================================

                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    "Court Record":
                                      decision as VerificationStatus,
                                  }));

                                  console.log(
                                    "COURT RECORD DECISION SAVED:",
                                    decision,
                                  );
                                } catch (error: any) {
                                  console.error(
                                    "FAILED TO SAVE COURT RECORD DECISION:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      "Failed to update Court Record decision",
                                  );
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "bank-statement" && (
                            <VerificationModuleCard
                              moduleName="Bank Statement"
                              status={status || ""}
                              decisionValue={
                                decisionStatus["Bank Statement"] || ""
                              }
                              onVerify={() => {
                                handleVerify("Bank Statement");
                              }}
                              onViewResult={async () => {
                                try {
                                  console.log(
                                    "========== LOADING BANK STATEMENT RESULT ==========",
                                  );

                                  const result = await getBankStatementResult(
                                    Number(id),
                                    candidate.bgv_id,
                                  );

                                  console.log("BANK STATEMENT RESULT:", result);

                                  if (!result) {
                                    alert(
                                      "Bank Statement verification result not found",
                                    );
                                    return;
                                  }

                                  setBankStatementResult(result);
                                  setShowBankStatementResult(true);
                                } catch (error: any) {
                                  console.error(
                                    "FAILED TO LOAD BANK STATEMENT RESULT:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      error?.message ||
                                      "Unable to load Bank Statement result",
                                  );
                                }
                              }}
                              onDecisionChange={async (decision) => {
                                try {
                                  console.log(
                                    "========== SAVING BANK STATEMENT DECISION ==========",
                                  );

                                  console.log({
                                    candidateId: Number(id),
                                    decision,
                                  });

                                  const response =
                                    await saveBankStatementDecision(
                                      Number(id),
                                      decision,
                                    );

                                  console.log(
                                    "BANK STATEMENT DECISION RESPONSE:",
                                    response,
                                  );

                                  if (
                                    response?.success === false ||
                                    response?.status === "error"
                                  ) {
                                    throw new Error(
                                      response?.message ||
                                        "Failed to save Bank Statement decision",
                                    );
                                  }

                                  // =================================================
                                  // UPDATE DECISION IMMEDIATELY
                                  // =================================================

                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    "Bank Statement": decision,
                                  }));

                                  // =================================================
                                  // UPDATE CARD STATUS IMMEDIATELY
                                  // =================================================

                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    "Bank Statement":
                                      decision as VerificationStatus,
                                  }));

                                  console.log(
                                    "BANK STATEMENT DECISION SAVED:",
                                    decision,
                                  );
                                } catch (error: any) {
                                  console.error(
                                    "BANK STATEMENT DECISION SAVE ERROR:",
                                    error,
                                  );

                                  alert(
                                    error?.message ||
                                      "Failed to save Bank Statement decision",
                                  );
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "face-match" && (
                            <VerificationModuleCard
                              moduleName="Face Match"
                              status={status || ""}
                              verificationStatus={faceMatchStatus}
                              decisionValue={decisionStatus["Face Match"] || ""}
                              onVerify={() => {
                                handleVerify("Face Match");
                              }}
                              onViewResult={async () => {
                                try {
                                  console.log(
                                    "========== LOADING FACE MATCH RESULT ==========",
                                  );

                                  const result = await getFaceMatchResult(
                                    Number(id),
                                  );

                                  console.log("FACE MATCH RESULT:", result);

                                  if (!result) {
                                    alert(
                                      "Face Match verification result not found",
                                    );
                                    return;
                                  }

                                  setFaceMatchResult(result);

                                  const status =
                                    result?.data?.verification_status ??
                                    result?.data?.data?.verification_status ??
                                    "";

                                  const confidence =
                                    result?.data?.confidence_score ??
                                    result?.data?.data?.confidence_score ??
                                    0;

                                  setFaceMatchStatus(status);

                                  setFaceMatchRisk(
                                    Number(confidence) >= 0.7 ? "LOW" : "HIGH",
                                  );

                                  // Load Aadhaar + Selfie images
                                  await loadFaceMatchImages();

                                  setShowFaceMatchResult(true);
                                } catch (error: any) {
                                  console.error(
                                    "FAILED TO LOAD FACE MATCH RESULT:",
                                    error,
                                  );

                                  alert(
                                    error?.response?.data?.message ||
                                      "Unable to load Face Match result",
                                  );
                                }
                              }}
                              onDecisionChange={async (decision) => {
                                try {
                                  await saveFaceMatchDecision(
                                    Number(id),
                                    decision,
                                  );

                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    "Face Match": decision,
                                  }));

                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    "Face Match":
                                      decision as VerificationStatus,
                                  }));

                                  await loadCandidate();
                                } catch (error) {
                                  console.log(error);
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "deepfake" && (
                            <DeepfakeVerificationCard
                              status={status || ""}
                              riskLevel={deepfakeRisk}
                              decisionValue={
                                decisionStatus["Deepfake Detection"] || ""
                              }
                              onViewResult={async () => {
                                try {
                                  const result = await getDeepfakeResult(
                                    Number(id),
                                  );

                                  setDeepfakeResult(result);

                                  const probability =
                                    result?.fake_probability ??
                                    result?.data?.fake_probability ??
                                    0;

                                  setDeepfakeRisk(
                                    probability >= 0.5 ? "HIGH" : "LOW",
                                  );

                                  setShowDeepfakeResult(true);
                                } catch (error) {
                                  console.log(error);
                                }
                              }}
                              onVerify={() =>
                                handleVerify("Deepfake Detection")
                              }
                              onDecisionChange={async (decision) => {
                                try {
                                  await saveDeepfakeDecision(
                                    Number(id),
                                    decision,
                                  );

                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    "Deepfake Detection": decision,
                                  }));

                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    "Deepfake Detection":
                                      decision as VerificationStatus,
                                  }));

                                  await loadCandidate();
                                } catch (error) {
                                  console.log(error);
                                }
                              }}
                            />
                          )}
                          {moduleConfig?.type === "resume" && status && (
                            <ResumeVerificationCard
                              decisionValue={
                                decisionStatus["Resume Parsing"] || ""
                              }
                              onViewResume={() => {
                                if (!resumeDocumentId) {
                                  alert("Resume not found");
                                  return;
                                }
                                setResumeUrl(
                                  `${API_URL}/documents/${resumeDocumentId}/view`,
                                );
                                setShowResumeViewer(true);
                              }}
                              onDecisionChange={async (decision) => {
                                try {
                                  await updateResumeDecision(
                                    Number(id),
                                    decision,
                                  );
                                  setDecisionStatus((prev) => ({
                                    ...prev,
                                    "Resume Parsing": decision,
                                  }));
                                  setModuleStatuses((prev) => ({
                                    ...prev,
                                    "Resume Parsing":
                                      decision as VerificationStatus,
                                  }));
                                  await loadCandidate();
                                } catch (error) {
                                  console.error(error);
                                  alert("Failed to update resume decision");
                                }
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleVerify(item)}
                          disabled={isVerifying}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                            isVerifying
                              ? "bg-gray-100 text-gray-500"
                              : "bg-[#5B5FEF] text-white hover:bg-[#4B4FD8]"
                          }`}
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Verify Now"
                          )}
                        </button>
                      )}
                    </div>
                  </VerificationCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showOCRDocumentSelector && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 w-[900px] max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Select Document For OCR</h2>
              <button
                onClick={() => setShowOCRDocumentSelector(false)}
                className="text-red-500 font-bold"
              >
                Close
              </button>
            </div>
            <div className="space-y-6">
              {Object.entries(groupedDocuments).map(
                ([documentType, docs]: any) => (
                  <div key={documentType} className="border rounded-2xl p-5">
                    <h3 className="text-lg font-bold mb-4">
                      📂 {documentType}
                    </h3>
                    <div className="space-y-2">
                      {docs.map((doc: any) => (
                        <button
                          key={doc.id}
                          className="w-full text-left bg-gray-50 hover:bg-indigo-50 border rounded-xl p-3 transition-all"
                          onClick={async () => {
                            try {
                              setShowOCRDocumentSelector(false);
                              const result = await processOCRDocument(
                                doc.id,
                                Number(id),
                              );
                              setOcrResult(result);
                              setShowOCRResult(true);
                            } catch (error) {
                              console.error(error);
                            }
                          }}
                        >
                          <div className="font-medium">
                            {doc.original_filename}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      <VerificationResultModal
        title="Salary Slip Verification Result"
        open={showSalarySlipResult}
        onClose={() => setShowSalarySlipResult(false)}
        data={<SalarySlipResultView data={salarySlipResult} />}
      />
      <VerificationResultModal
        title="Employment Verification Result"
        open={showEmploymentResult}
        onClose={() => setShowEmploymentResult(false)}
        data={<EmploymentResultView data={employmentResult} />}
      />
      <VerificationResultModal
        title="Credit Bureau Verification Result"
        open={showCreditBureauResult}
        onClose={() => setShowCreditBureauResult(false)}
        data={<CreditBureauResultView data={creditBureauResult} />}
      />
      <VerificationResultModal
        title="Bank Statement Verification Result"
        open={showBankStatementResult}
        onClose={() => setShowBankStatementResult(false)}
        data={<BankStatementResultView data={bankStatementResult} />}
      />
      <VerificationResultModal
        title="Court Record Verification Result"
        open={showCourtRecordResult}
        onClose={() => setShowCourtRecordResult(false)}
        data={<CourtRecordResultView data={courtRecordResult} />}
      />
      <VerificationResultModal
        title="Aadhaar Verification Result"
        open={showAadhaarResult}
        onClose={() => setShowAadhaarResult(false)}
        data={
          <AadhaarResultView
            data={aadhaarResult}
            candidateDocument={aadhaarDocument}
          />
        }
      />
      <VerificationResultModal
        title="Passport Verification Result"
        open={showPassportResult}
        onClose={() => setShowPassportResult(false)}
        data={<PassportResultView data={passportResult} />}
      />
      <VerificationResultModal
        title="Driving License Verification Result"
        open={showDrivingLicenseResult}
        onClose={() => setShowDrivingLicenseResult(false)}
        data={<DrivingLicenseResultView data={drivingLicenseResult} />}
      />
      <VerificationResultModal
        title="PAN Verification Result"
        open={showPanResult}
        onClose={() => {
          setShowPanResult(false);
        }}
        data={<PANResultView data={panResult} />}
      />
      <VerificationResultModal
        title="Face Match Result"
        open={showFaceMatchResult}
        onClose={() => setShowFaceMatchResult(false)}
        data={
          <FaceMatchResultView
            data={faceMatchResult}
            aadhaarImageUrl={faceMatchAadhaarUrl}
            selfieImageUrl={faceMatchSelfieUrl}
          />
        }
      />
      <VerificationResultModal
        title="Deepfake Detection Result"
        open={showDeepfakeResult}
        onClose={() => setShowDeepfakeResult(false)}
        data={<DeepfakeResultView data={deepfakeResult} />}
      />
      <VerificationResultModal
        title="AML & Global Watchlist Result"
        open={showWatchlistModal}
        onClose={() => setShowWatchlistModal(false)}
        data={<WatchlistResultView data={watchlistResult} />}
      />

      {showResumeViewer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-3xl w-[850px] h-[95vh] relative overflow-hidden">
            <button
              onClick={() => setShowResumeViewer(false)}
              className="absolute top-4 right-4 z-50 px-3 py-1 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition"
            >
              Close
            </button>
            <embed
              src={`${resumeUrl}#toolbar=0`}
              type="application/pdf"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CandidateVerificationCenter;
