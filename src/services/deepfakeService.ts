import axios from "../api/axios";

export const deepfakeService = {
  analyzeMedia: async (candidateId: number) => {
    const response = await axios.post(`/api/verification/deepfake/${candidateId}/analyze`);
    return response.data;
  },
  
  updateAuditLog: async (candidateId: number, result: string) => {
    await axios.patch(`/api/audit/deepfake/${candidateId}`, { result });
  }
};