import axios from "./axios";
import { extractArray } from "../utils/safeArray";

export const getCandidates = async () => {
  const response = await axios.get("/candidates");

  return extractArray(response.data);
};

export const createCandidate = async (candidateData: unknown) => {
  const response = await axios.post("/candidates/create", candidateData);

  return response.data;
};

export const deleteCandidateApi = async (id: number) => {
  const response = await axios.delete(`/candidates/${id}`);

  return response.data;
};

export const updateCandidateStatusApi = async (id: number, data: unknown) => {
  const response = await axios.put(`/candidates/${id}/status`, data);

  return response.data;
};

export const getCandidateById = async (id: number) => {
  const response = await axios.get(`/candidates/${id}`);

  return response.data;
};

export const updateCandidateApi = async (id: number, data: unknown) => {
  const response = await axios.put(`/candidates/${id}`, data);

  return response.data;
};

export const generateCandidateLink = async (candidateId: number) => {
  const response = await axios.post("/candidate/generate-link", {
    candidate_id: candidateId,
    bgv_id: 1,
  });

  return response.data;
};

export const validateCandidateLink = async (secureToken: string) => {
  const response = await axios.get(`/candidate/validate-link/${secureToken}`);

  return response.data;
};

export const uploadCandidateDocument = async (
  secureToken: string,
  documentType: string,
  file: File,
) => {
  const formData = new FormData();

  formData.append("secure_token", secureToken);

  formData.append("document_type", documentType);

  formData.append("file", file);

  const response = await axios.post("/candidate/upload-document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const submitCandidateDocuments = async (candidateId: number) => {
  const response = await axios.post("/candidate/submit-documents", {
    candidate_id: candidateId,
  });

  return response.data;
};

export const getCandidateDocuments = async (candidateId: number) => {
  const response = await axios.get(`/candidates/${candidateId}/documents`);

  return response.data;
};
