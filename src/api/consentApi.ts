import axios from "./axios";

export const saveCandidateConsent = async (
  candidateId: number,
  bgvId: string,
  verificationType: string,
  consentText: string,
) => {
  const response = await axios.post("/consent/candidate-consent", {
    candidate_id: candidateId,
    bgv_id: bgvId,
    verification_type: verificationType,
    consent_status: "GIVEN",
    consent_text: consentText,
    consent_version: "1.0",
    consent_source: "PORTAL",
  });

  return response.data;
};
