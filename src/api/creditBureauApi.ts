import axios from "./axios";

export const verifyCreditBureau = async (
  candidateId: number,
  bgvId: string,
) => {
  const response = await axios.post("/credit-bureau/verify", {
    candidate_id: candidateId,
    bgv_id: bgvId,
  });

  return response.data;
};

export const getCreditBureauResult = async (candidateId: number) => {
  const response = await axios.get(`/credit-bureau/result/${candidateId}`);

  return response.data;
};

export const saveCreditBureauDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/credit-bureau/decision", {
    candidate_id: candidateId,
    decision,
  });

  return response.data;
};
