import { parseResume } from "../api/resumeApi";
import { screenWatchlist } from "../api/watchlistApi";
import { processOCR } from "../api/ocrApi";
import { verifySalarySlip } from "../api/salarySlipApi";
const verificationHandlers = {

  "Resume Parsing": parseResume,

  "Watchlist": screenWatchlist,

  "OCR Verification": processOCR,

  "Salary Slip": verifySalarySlip

};

export const executeVerification = async (

  moduleName: string,

  candidateId: number,

  ...args: any[]

) => {

  const handler =

    verificationHandlers[
      moduleName as keyof typeof verificationHandlers
    ];

  if (!handler) {

    throw new Error(
      `No executor configured for ${moduleName}`
    );

  }

  return await (handler as any)(
    candidateId,
    ...args
  );

};