import axios from "./axios";

export const screenWatchlist = async (
  candidateId: number
) => {

const response = await axios.post(
  `/global_database/screen/${candidateId}`
);

  return response.data;
};
export const updateWatchlistDecision = async (
  candidateId: number,
  decision: string
) => {

  const response = await axios.post(
    "/global_database/decision",
    {
      candidate_id: candidateId,
      decision
    }
  );

  return response.data;
};