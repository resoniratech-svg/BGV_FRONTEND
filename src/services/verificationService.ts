// src/services/verificationService.ts
import axios from "../api/axios";

export const verifyAadhaar = async (candidateId: number) => {
  // This replaces the localStorage logic with a real API call
  const response = await axios.post(`/api/verification/aadhaar/${candidateId}`);
  return response.data; // Expected: { status: "Completed", newProgress: 16 }
};