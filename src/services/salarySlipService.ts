// import axios from "../api/axios";

// export const salarySlipService = {
//   verifySalary: async (candidateId: number) => {
//     const response = await axios.post(`/api/verification/salary/${candidateId}/verify`);
//     return response.data;
//   },
//   updateAuditLog: async (candidateId: number, status: string) => {
//     await axios.patch(`/api/audit/salary/${candidateId}`, { status });
//   }
// };

import { verifySalarySlip } from "../api/salarySlipApi";

export const salarySlipService = {
  verifySalarySlip: async (
    candidateId: number,
    bgvId: number,
    documentId: number,
  ) => {
    return await verifySalarySlip(candidateId, bgvId, documentId);
  },
};
