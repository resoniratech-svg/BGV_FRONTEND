export const extractArray = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.candidates)) return res.candidates;
  if (Array.isArray(res.users)) return res.users;
  if (Array.isArray(res.logs)) return res.logs;
  if (Array.isArray(res.notifications)) return res.notifications;
  if (Array.isArray(res.results)) return res.results;
  if (Array.isArray(res.reports)) return res.reports;
  if (Array.isArray(res.cases)) return res.cases;
  return [];
};
