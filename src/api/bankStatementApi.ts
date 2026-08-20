import axios from "./axios";

/**
 * Save Bank Statement details
 */
export const saveBankStatementDetails = async (
  secureToken: string,
  bankName: string,
  bankStatementPassword: string,
) => {
  const response = await axios.post("/candidate/bank-statement/details", {
    secure_token: secureToken,
    bank_name: bankName,
    bank_statement_password: bankStatementPassword,
  });

  return response.data;
};

/**
 * Start Bank Statement verification
 */
export const verifyBankStatement = async (
  candidateId: number,
  bgvId: string | number,
  documentId: number,
) => {
  const response = await axios.post("/bank-statement/upload", {
    candidate_id: candidateId,
    bgv_id: bgvId,
    document_id: documentId,
  });

  return response.data;
};

/**
 * Get saved Bank Statement verification result
 */
export const getBankStatementResult = async (
  candidateId: number,
  bgvId: string | number,
) => {
  const response = await axios.get(`/bank-statement/result/${candidateId}`, {
    params: {
      bgv_id: bgvId,
    },
  });

  return response.data;
};

/**
 * Save Bank Statement admin decision
 */
export const saveBankStatementDecision = async (
  candidateId: number,
  decision: string,
) => {
  const response = await axios.post("/bank-statement/decision", {
    candidate_id: candidateId,
    decision,
  });

  return response.data;
};
