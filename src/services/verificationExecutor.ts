import { parseResume } from "../api/resumeApi";
import { screenWatchlist } from "../api/watchlistApi";
import { processOCR } from "../api/ocrApi";
import { verifySalarySlip } from "../api/salarySlipApi";

export async function executeVerification(
  moduleName: "Resume Parsing",
  candidateId: number
): Promise<unknown>;
export async function executeVerification(
  moduleName: "Watchlist",
  candidateId: number
): Promise<unknown>;
export async function executeVerification(
  moduleName: "OCR Verification",
  candidateId: number,
  file: File,
  documentType: string
): Promise<unknown>;
export async function executeVerification(
  moduleName: "Salary Slip",
  candidateId: number,
  bgvId: string,
  documentId: number
): Promise<unknown>;
export async function executeVerification(
  moduleName: string,
  candidateId: number,
  arg1?: File | string,
  arg2?: string | number
): Promise<unknown> {
  if (moduleName === "Resume Parsing") {
    return await parseResume(candidateId);
  }
  if (moduleName === "Watchlist") {
    return await screenWatchlist(candidateId);
  }
  if (
    moduleName === "OCR Verification" &&
    arg1 instanceof File &&
    typeof arg2 === "string"
  ) {
    return await processOCR(arg1, candidateId, arg2);
  }
  if (
    moduleName === "Salary Slip" &&
    typeof arg1 === "string" &&
    typeof arg2 === "number"
  ) {
    return await verifySalarySlip(candidateId, arg1, arg2);
  }

  throw new Error(`No executor configured for ${moduleName}`);
}