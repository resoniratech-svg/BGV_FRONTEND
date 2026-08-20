import axios from "./axios";

export const parseResume = async (
  candidateId: number
) => {

  const response = await axios.post(
    "/resume/parse",
    {
      candidate_id: candidateId
    }
  );

  return response.data;
};

export const getParsedResume = async (
  candidateId: number
) => {

  const response = await axios.get(
    `/resume/${candidateId}`
  );

  return response.data;
};
export const updateResumeDecision = async (
  candidateId: number,
  decision: string
) => {

  const response = await axios.put(
    `/resume/${candidateId}/decision`,
    {
      decision
    }
  );

  return response.data;
};