// src/services/candidateService.ts
import axios from "../api/axios";
import type{ Candidate } from "../types/Candidate";

export const candidateService = {
  // Fetch all candidates from the database
  getAllCandidates: async () => {
    const response = await axios.get("/api/candidates");
    return response.data;
  },

  // Create a new candidate profile
  createCandidate: async (candidateData: Omit<Candidate, "id">) => {
    const response = await axios.post("/api/candidates", candidateData);
    return response.data;
  },

  // Update candidate status (e.g., "Request Sent", "Documents Uploaded")
  updateCandidateStatus: async (id: number, status: string, progress: number) => {
    const response = await axios.patch(`/api/candidates/${id}/status`, { 
      status, 
      progress 
    });
    return response.data;
  },

  // Get single candidate details
  getCandidateById: async (id: string) => {
    const response = await axios.get(`/api/candidates/${id}`);
    return response.data;
  }
};