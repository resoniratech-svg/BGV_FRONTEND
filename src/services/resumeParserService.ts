import axios from "../api/axios";

export const resumeParserService = {
  parseResume: async (candidateId: number) => {
    const response = await axios.post(`/api/verification/resume/${candidateId}/parse`);
    return response.data;
  },
  updateAuditLog: async (candidateId: number, status: string) => {
    await axios.patch(`/api/audit/resume/${candidateId}`, { status });
  }
};