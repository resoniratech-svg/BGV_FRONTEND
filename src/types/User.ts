export interface SystemUser {
  id: number;
  username: string;
  role: "SUPER_ADMIN" | "ADMIN" | "VERIFICATION_OFFICER" | "FRAUD_ANALYST" | "recruiter";
  is_active: boolean;
  created_at: string;
}