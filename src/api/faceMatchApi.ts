import axios from "./axios";

export const verifyFaceMatch = async (
  candidateId: number,
  bgvId: string | number,
  documentId: number,
) => {
  const response = await axios.post("/face-match/verify", {
    candidate_id: candidateId,
    bgv_id: bgvId,
    document_id: documentId,
  });

  return response.data;
};

export const getFaceMatchResult = async (candidateId: number) => {
  const response = await axios.get(`/face-match/result/${candidateId}`);
  return response.data;
};

export const saveFaceMatchDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/face-match/decision", {
    candidate_id: candidateId,
    decision,
  });

  return response.data;
};
