import axios from "./axios";

/**
 * Save successful Gridlines Aadhaar SDK result.
 *
 * Used by the candidate secure-link flow.
 */
export const saveAadhaarResult = async (
  secureToken: string,
  aadhaarData: any,
) => {
  const response = await axios.post("/candidate/aadhaar/result", {
    secure_token: secureToken,
    aadhaar_data: aadhaarData,
  });

  return response.data;
};

/**
 * Fetch saved Aadhaar verification result
 * for CandidateVerificationCenter.
 *
 * Backend:
 * GET /aadhaar/result/<candidate_id>
 */
export const getAadhaarResult = async (candidateId: number) => {
  const response = await axios.get(`/aadhaar/result/${candidateId}`);

  return response.data;
};

/**
 * Save Aadhaar reviewer decision.
 *
 * Backend:
 * POST /aadhaar/decision
 */
export const saveAadhaarDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/aadhaar/decision", {
    candidate_id: candidateId,
    decision,
  });

  return response.data;
};
