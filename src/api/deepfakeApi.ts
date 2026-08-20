import axios from "./axios";

export const verifyDeepfake = async (candidateId: number) => {
  const response = await axios.post(`/deepfake/verify/${candidateId}`);

  return response.data;
};

export const getDeepfakeResult = async (candidateId: number) => {
  const response = await axios.get(`/deepfake/result/${candidateId}`);

  return response.data;
};
export const saveDeepfakeDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/deepfake/decision", {
    candidate_id: candidateId,
    decision,
  });

  return response.data;
};
