export interface Report {
  id: number;
  candidate_id: number;
  candidate_name?: string;
  report_name: string;
  report_status: string;
  verification_status: string;
  file_name: string;
  file_url: string;
  generated_at: string;
}