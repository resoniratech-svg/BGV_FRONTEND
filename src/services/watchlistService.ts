import axios from "../api/axios";

export const watchlistService = {
  runScreening: async (candidateId: number) => {
    const response = await axios.post(`/api/verification/watchlist/${candidateId}/screen`);
    return response.data;
  },
  updateAuditLog: async (candidateId: number, status: string) => {
    await axios.patch(`/api/audit/watchlist/${candidateId}`, { status });
  }
};