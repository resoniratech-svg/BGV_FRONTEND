// src/services/creditBureauService.ts
import axios from "../api/axios";

export interface CreditBureauPayload {
  candidateId: number;
  bureauType: string; // e.g., "CIBIL", "Experian"
  consentObtained: boolean;
}

export const creditBureauService = {
  // Fetch pending credit checks
  getPendingCreditChecks: async () => {
    const response = await axios.get("/api/verification/credit-bureau/pending");
    return response.data;
  },

  // Initiate credit bureau validation via API
  verifyCreditScore: async (candidateId: number, data: CreditBureauPayload) => {
    const response = await axios.post(`/api/verification/credit-bureau/${candidateId}/verify`, data);
    return response.data; // Expected: { status: "Verified", score: 750, risk: "Low" }
  },

  // Update audit trail
  updateAuditLog: async (candidateId: number, status: string) => {
    const response = await axios.patch(`/api/audit/credit-bureau/${candidateId}`, { status });
    return response.data;
  }
};