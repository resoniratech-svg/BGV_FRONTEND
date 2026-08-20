import axios from "./axios";

export const updateVerificationSummary = async (
  candidateId: number,
  moduleName: string,
  status: string,
  riskLevel?: string,
) => {
  const response = await axios.post("/verification-summary/update", {
    candidate_id: candidateId,
    module_name: moduleName,
    status,
    risk_level: riskLevel,
  });

  return response.data;
};

export const getVerificationSummary = async (candidateId: number) => {
  const response = await axios.get(`/verification-summary/${candidateId}`);

  return response.data;
};

export const getPendingCandidates = async (moduleName: string) => {
  const response = await axios.get(
    `/verification-summary/${moduleName}/pending`,
  );

  return response.data;
};

export const getCandidatesByStatus = async (
  moduleName: string,
  status: string,
) => {
  const response = await axios.get(
    `/verification-summary/${moduleName}/status/${status}`,
  );

  return response.data;
};

export const getModuleStatistics = async (moduleName: string) => {
  const response = await axios.get(`/verification-summary/${moduleName}/stats`);

  return response.data;
};
