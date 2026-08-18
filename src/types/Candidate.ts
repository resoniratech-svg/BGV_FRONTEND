export interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone: string;

  status: string;

  first_name?: string;
  last_name?: string;

  company_name?: string;   // ADD THIS
  bgv_id?: string;
  role?: string;
  job_role?: string;
  progress?: number;

  aadhaarStatus?: string;
  panStatus?: string;
  passportStatus?: string;
  dlStatus?: string;
  faceMatchStatus?: string;
  fraudStatus?: string;
  createdAt?: string;

  state?: string;
  ocrVerified?: boolean;
  panVerified?: boolean;
  panNumber?: string;
  passportVerified?: boolean;
  passportNumber?: string;

  country?: string;

  reviewer?: string;
  moduleStatuses?: Record<string, string>;
  uploadedFiles?: Record<string, string | string[] | null>;
}