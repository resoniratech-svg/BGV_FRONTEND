import axios from "../api/axios";

export const bankStatementService = {
  uploadBankStatement: async (
    candidateId: number,
    bgvId: string | number,
    documentId: number,
    bankName?: string | null,
    bankStatementPassword?: string | null,
  ) => {
    const response = await axios.post("/bank-statement/upload", {
      candidate_id: candidateId,
      bgv_id: bgvId,
      document_id: documentId,
      bank_name: bankName,
      bank_statement_password: bankStatementPassword,
    });

    return response.data;
  },

  getBankStatementResult: async (candidateId: number) => {
    const response = await axios.get(`/bank-statement/result/${candidateId}`);

    return response.data;
  },
};
