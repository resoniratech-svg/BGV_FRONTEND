import axios from "./axios";

export const verifyPassport = async (
  candidateId: number,
  bgvId: string,
  frontDocumentId: number,
  backDocumentId: number,
) => {
  const response = await axios.post("/passport/verify", {
    candidate_id: candidateId,
    bgv_id: bgvId,
    front_document_id: frontDocumentId,
    back_document_id: backDocumentId,
  });

  return response.data;
};

export const getPassportResult = async (candidateId: number) => {
  const response = await axios.get(`/passport/result/${candidateId}`);

  return response.data;
};

export const savePassportDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/passport/decision", {
    candidate_id: candidateId,
    decision: decision,
  });

  return response.data;
};
