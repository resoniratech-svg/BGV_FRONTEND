import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "../pages/auth/Login";

// Candidate Portal (Standalone)
import CandidatePortal from "../pages/portal/CandidatePortal";

// Dashboard
import Dashboard from "../pages/dashboard/Dashboard";

// Candidates
import Candidates from "../pages/candidates/Candidates";
import CandidateDetails from "../pages/candidates/CandidateDetails";
import AddCandidate from "../pages/candidates/AddCandidate";
import EditCandidate from "../pages/candidates/EditCandidate";

// Verification
import VerificationCenter from "../pages/verification/VerificationCenter";
import AadhaarVerification from "../pages/verification/AadhaarVerification";
import PANVerification from "../pages/verification/PANVerification";
import PassportVerification from "../pages/verification/PassportVerification";
import DLVerification from "../pages/verification/DLVerification";
import FaceMatch from "../pages/verification/FaceMatch";
import OCRVerification from "../pages/verification/OCRVerification";
import VerificationQueue from "../pages/verification/VerificationQueue";
import CandidateVerificationCenter from "../pages/verification/CandidateVerificationCenter";

// New Verification Modules
import DeepfakeDetection from "../pages/verification/DeepfakeDetection";
import ResumeParsing from "../pages/verification/ResumeParsing";
import EducationVerification from "../pages/verification/EducationVerification";
import EmploymentVerification from "../pages/verification/EmploymentVerification";
import SalarySlipVerification from "../pages/verification/SalarySlipVerification";
import CreditBureauCheck from "../pages/verification/CreditBureauCheck";
import CourtRecordVerification from "../pages/verification/CourtRecordVerification";
import GlobalWatchlistScreening from "../pages/verification/GlobalWatchlistScreening";

// Fraud Center
import FraudCenter from "../pages/fraud/FraudCenter";

// Uploads
import UploadDocuments from "../pages/uploads/UploadDocuments";
import CandidateDocuments from "../pages/uploads/CandidateDocuments";

// Reports
import Reports from "../pages/reports/Reports";

// Analytics
import Analytics from "../pages/analytics/Analytics";

// Notifications
import Notifications from "../pages/notifications/Notifications";


// Admin
import AdminPanel from "../pages/admin/AdminPanel";
import AddAdmin from "../pages/admin/AddAdmin";

// Audit
import AuditLogs from "../pages/audit/AuditLogs";

// User Management
import UserManagement from "../pages/users/UserManagement";

// Settings
import Settings from "../pages/settings/Settings";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        
        {/* Candidate Portal (Standalone, no DashboardLayout) */}
        <Route path="/portal/:id" element={<CandidatePortal />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        {/* Candidates */}
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/new" element={<AddCandidate />} />
        <Route path="/candidates/edit/:id" element={<EditCandidate />} />
        <Route path="/candidates/:id" element={<CandidateDetails />} />
        <Route path="/add-candidate" element={<AddCandidate />} />

        {/* Verification */}
        <Route path="/verification" element={<VerificationCenter />} />
        <Route path="/verification/aadhaar" element={<AadhaarVerification />} />
        <Route path="/verification/pan" element={<PANVerification />} />
        <Route path="/verification/passport" element={<PassportVerification />} />
        <Route path="/verification/dl" element={<DLVerification />} />
        <Route path="/verification/face-match" element={<FaceMatch />} />
        <Route path="/verification/ocr" element={<OCRVerification />} />
        <Route path="/verification/deepfake" element={<DeepfakeDetection />} />
        <Route path="/verification/resume-parsing" element={<ResumeParsing />} />
        <Route path="/verification/education" element={<EducationVerification />} />
        <Route path="/verification/employment" element={<EmploymentVerification />} />
        <Route path="/verification/salary-slip" element={<SalarySlipVerification />} />
        <Route path="/verification/credit-bureau" element={<CreditBureauCheck />} />
        <Route path="/verification/court-record" element={<CourtRecordVerification />} />
        <Route path="/verification/watchlist" element={<GlobalWatchlistScreening />} />
        <Route path="/verification/queue" element={<VerificationQueue />} />
        <Route path="/verification/candidate/:id" element={<CandidateVerificationCenter />} />

        {/* Fraud Center */}
        <Route path="/fraud-center" element={<FraudCenter />} />

        {/* Uploads */}
        <Route path="/uploads" element={<UploadDocuments />} />
        <Route path="/uploads/:id" element={<CandidateDocuments />} />

        {/* Others */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/add-admin" element={<AddAdmin />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;