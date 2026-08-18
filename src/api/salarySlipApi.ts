import axios from "./axios";

export const verifySalarySlip = async (
  candidateId: number,
  bgvId: string,
  documentId: number,
) => {
  const response = await axios.post("/salary-slip/ocr", {
    candidate_id: candidateId,
    bgv_id: bgvId,
    document_id: documentId,
  });

  return response.data;
};

export const getSalarySlipResult = async (candidateId: number) => {
  const response = await axios.get(`/salary-slip/result/${candidateId}`);
  return response.data;
};

export const updateSalarySlipDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/salary-slip/decision", {
    candidate_id: candidateId,
    decision,
  });

  return response.data;
};
