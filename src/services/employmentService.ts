import axios from "../api/axios";

export const employmentService = {
  verifyEmployment: async (candidateId: number) => {
    const response = await axios.post(`/api/verification/employment/${candidateId}/verify`);
    return response.data;
  },
  updateAuditLog: async (candidateId: number, status: string) => {
    await axios.patch(`/api/audit/employment/${candidateId}`, { status });
  }
};