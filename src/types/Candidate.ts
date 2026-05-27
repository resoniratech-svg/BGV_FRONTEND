export interface Candidate {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  status: string;
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
  
  // Added properties for verification modules
  state?: string;
  ocrVerified?: boolean;
  panVerified?: boolean;
  panNumber?: string;
  passportVerified?: boolean;
  passportNumber?: string;
  country?: string;
  reviewer?: string;
  moduleStatuses?: Record<string, string>;
}