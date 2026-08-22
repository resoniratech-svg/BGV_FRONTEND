import axios from "./axios";

export const getAuditLogs = async () => {
  const response = await axios.get("/audit/logs");

  return response.data.data;
};

export const getAuditStats = async () => {
  const response = await axios.get("/audit/stats");

  return response.data.data;
};
export const exportAuditLogs = async () => {
  const response = await axios.get("/audit/export", {
    responseType: "blob",
  });

  return response;
};
