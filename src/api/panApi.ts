import axios from "./axios";

export const verifyPAN = async (
  candidateId: number,

  bgvId: string,

  documentId: number,
) => {
  const response = await axios.post(
    "/pan/verify",

    {
      candidate_id: candidateId,

      bgv_id: bgvId,

      document_id: documentId,
    },
  );

  return response.data;
};
export const savePANDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/pan/decision", {
    candidate_id: candidateId,
    decision,
  });

  return response.data;
};
export const getPANResult = async (candidateId: number) => {
  const response = await axios.get(`/pan/result/${candidateId}`);

  return response.data;
};
