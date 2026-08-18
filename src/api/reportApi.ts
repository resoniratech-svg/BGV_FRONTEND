import api from "./axios";

export const getAllReports = async () => {
  const response = await api.get("/report");
  return response.data;
};

export const generateReport = async (candidateId: number) => {
  const response = await api.post(`/report/generate/${candidateId}`);

  return response.data;
};

export const downloadReport = async (candidateId: number) => {
  const response = await api.get(`/report/download/${candidateId}`, {
    responseType: "blob",
  });

  return response;
};
export const viewReport = async (candidateId: number) => {
  const response = await api.get(`/report/view/${candidateId}`);

  return response.data;
};
export const exportReports = async () => {
  const response = await api.get("/report/export", {
    responseType: "blob",
  });

  return response;
};
