import axios from "../api/axios";

export const educationService = {
  verifyEducation: async (candidateId: number) => {
    const response = await axios.post(`/api/verification/education/${candidateId}/verify`);
    return response.data;
  },
  updateAuditLog: async (candidateId: number, status: string) => {
    await axios.patch(`/api/audit/education/${candidateId}`, { status });
  }
};