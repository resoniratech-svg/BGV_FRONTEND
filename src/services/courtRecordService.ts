// src/services/courtRecordService.ts
import axios from "../api/axios";

// This interface mirrors the backend's expected structure for court record checks
export interface CourtRecordPayload {
  candidateId: number;
  caseType: string;
  jurisdiction: string;
}

export const courtRecordService = {
  // Fetch all pending court record checks
  getPendingChecks: async () => {
    const response = await axios.get("/api/verification/court-records/pending");
    return response.data;
  },

  // Initiate a specific court record check via API
  verifyRecord: async (candidateId: number, data: CourtRecordPayload) => {
    const response = await axios.post(`/api/verification/court-records/${candidateId}/verify`, data);
    return response.data; // Expected: { status: "Verified", riskLevel: "Low" }
  },

  // Update status in the central audit log
  updateAuditLog: async (candidateId: number, status: string) => {
    const response = await axios.patch(`/api/audit/court-records/${candidateId}`, { status });
    return response.data;
  }
};