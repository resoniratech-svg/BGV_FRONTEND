import axios from "./axios";

export const verifyEmployment = async (candidateId: number, bgvId: string) => {
  const response = await axios.post("/employment/verify", {
    candidate_id: candidateId,
    bgv_id: bgvId,
  });

  return response.data;
};

export const getEmploymentResult = async (candidateId: number) => {
  const response = await axios.get(`/employment/result/${candidateId}`);

  return response.data;
};

export const saveEmploymentDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/employment/decision", {
    candidate_id: candidateId,
    decision,
  });

  return response.data;
};
