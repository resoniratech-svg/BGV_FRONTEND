import axios from "./axios";

/**
 * ============================================================
 * COURT RECORD / CCRV VERIFICATION
 * ============================================================
 */

/**
 * Start Court Record / CCRV verification
 *
 * Backend:
 * POST /ccrv/verify
 */
export const verifyCourtRecord = async (candidateId: number, bgvId: string | number) => {
  const response = await axios.post("/ccrv/verify", {
    candidate_id: candidateId,
    bgv_id: bgvId,
  });

  return response.data;
};

/**
 * ============================================================
 * GET COURT RECORD RESULT
 * ============================================================
 *
 * Backend:
 * GET /ccrv/result/<candidate_id>
 */
export const getCourtRecordResult = async (candidateId: number) => {
  const response = await axios.get(`/ccrv/result/${candidateId}`);

  return response.data;
};

/**
 * ============================================================
 * SAVE COURT RECORD DECISION
 * ============================================================
 *
 * Backend:
 * POST /ccrv/decision
 */
export const saveCourtRecordDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/ccrv/decision", {
    candidate_id: candidateId,
    decision,
  });

  return response.data;
};
