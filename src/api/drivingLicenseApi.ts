import axios from "./axios";

// ======================================================
// VERIFY DRIVING LICENSE
// ======================================================

export const verifyDrivingLicense = async (
  candidateId: number,
  bgvId: string,
  frontDocumentId: number,
  backDocumentId: number,
) => {
  const response = await axios.post("/driving-license/verify", {
    candidate_id: candidateId,
    bgv_id: bgvId,
    front_document_id: frontDocumentId,
    back_document_id: backDocumentId,
  });

  return response.data;
};

// ======================================================
// GET DRIVING LICENSE RESULT
// ======================================================

export const getDrivingLicenseResult = async (candidateId: number) => {
  const response = await axios.get(`/driving-license/result/${candidateId}`);

  return response.data;
};

// ======================================================
// SAVE DRIVING LICENSE DECISION
// ======================================================

export const saveDrivingLicenseDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/driving-license/decision", {
    candidate_id: candidateId,
    decision,
  });

  return response.data;
};
