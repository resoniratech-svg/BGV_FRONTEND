import api from "./axios";

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");

  console.log(response.data);

  return response.data.data;
};
